/* eslint-disable max-lines */
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  useAddAttachmentsMutation,
  useCreateClaimMutation,
  useGetAttachmentTypesQuery,
  useGetClientDemandsQuery,
  useGetFlawsQuery,
  useGetReasonsQuery,
} from 'src/entities/Claim';
import { useGetDocumentQuery } from 'src/entities/Document';
import { configHelperFactory } from 'src/shared/lib/configurations';
import { Button } from 'src/shared/ui/buttons/Button/Button';
import { AttachmentsStep } from './AttachmentsStep';
import { ClaimDetailsStep } from './ClaimDetailsStep';
import s from './ClaimFormPage.module.scss';
import { ClaimResult } from './ClaimResult';
import { ProductStep } from './ProductStep';
import { ReviewStep } from './ReviewStep';
import { getRequestErrorMessage } from '../lib/getRequestErrorMessage';
import {
  CLAIM_STEPS,
  ClaimAttachment,
  ClaimFormState,
  ClaimStep,
  createEmptyClaimForm,
  fromPersistedClaimDraft,
  getAttachmentFingerprint,
  getDraftKey,
  getFileFingerprint,
  isPersistedClaimDraft,
  toPersistedClaimDraft,
} from '../model/claimForm';

const configuration = configHelperFactory();

const createLocalId = () => crypto.randomUUID?.() ?? `file-${Date.now()}-${Math.random()}`;

const ClaimFormPage = () => {
  const { documentId = '' } = useParams<{ documentId: string }>();
  const [formState, setFormState] = useState<ClaimFormState>(createEmptyClaimForm);
  const [isHydrated, setIsHydrated] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [pageError, setPageError] = useState('');
  const [draftMessage, setDraftMessage] = useState('Восстанавливаем черновик…');
  const [selectedAttachmentType, setSelectedAttachmentType] = useState('');
  const [claimNumber, setClaimNumber] = useState('');

  const documentQuery = useGetDocumentQuery({ documentId }, { skip: !documentId });
  const reasonsQuery = useGetReasonsQuery(undefined, { skip: !documentId });
  const demandsQuery = useGetClientDemandsQuery(undefined, { skip: !documentId });
  const attachmentTypesQuery = useGetAttachmentTypesQuery(undefined, { skip: !documentId });
  const selectedLineIds = useMemo(
    () => Object.keys(formState.selectedLines),
    [formState.selectedLines],
  );
  const flawsQuery = useGetFlawsQuery(
    { lineIds: selectedLineIds, reason: formState.reasonId },
    { skip: selectedLineIds.length === 0 || !formState.reasonId },
  );
  const [addAttachments, addAttachmentsState] = useAddAttachmentsMutation();
  const [createClaim, createClaimState] = useCreateClaimMutation();

  const products = useMemo(() => {
    if (!documentQuery.data?.success) return [];
    const productLines = documentQuery.data.data.details.filter((detail) => detail.isProduct);
    return productLines.length ? productLines : documentQuery.data.data.details;
  }, [documentQuery.data]);
  const reasons = reasonsQuery.data?.success ? reasonsQuery.data.data : [];
  const demands = demandsQuery.data?.success ? demandsQuery.data.data : [];
  const flaws = useMemo(
    () => (flawsQuery.data?.success ? flawsQuery.data.data.flaws : []),
    [flawsQuery.data],
  );
  const attachmentTypes = useMemo(
    () =>
      attachmentTypesQuery.data?.success
        ? [...attachmentTypesQuery.data.data].sort((left, right) => left.order - right.order)
        : [],
    [attachmentTypesQuery.data],
  );

  useEffect(() => {
    let isCurrent = true;
    setIsHydrated(false);
    setFormState(createEmptyClaimForm());
    setDraftMessage('Восстанавливаем черновик…');

    if (!documentId) return () => undefined;

    configuration
      .getConfiguration(getDraftKey(documentId), null, isPersistedClaimDraft)
      .then((draft) => {
        if (!isCurrent) return;
        if (draft) {
          setFormState(fromPersistedClaimDraft(draft));
          setDraftMessage('Черновик восстановлен');
        } else {
          setDraftMessage('Черновик сохраняется автоматически');
        }
      })
      .catch(() => {
        if (isCurrent) setDraftMessage('Не удалось восстановить черновик');
      })
      .finally(() => {
        if (isCurrent) setIsHydrated(true);
      });

    return () => {
      isCurrent = false;
    };
  }, [documentId]);

  useEffect(() => {
    if (!isHydrated || !documentId || claimNumber) return undefined;

    const timeoutId = window.setTimeout(() => {
      configuration
        .setConfiguration(getDraftKey(documentId), toPersistedClaimDraft(formState))
        .then(() => setDraftMessage('Черновик сохранён'))
        .catch(() => setDraftMessage('Не удалось сохранить черновик'));
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [claimNumber, documentId, formState, isHydrated]);

  useEffect(() => {
    if (!isHydrated || claimNumber) return undefined;
    const hasDraft =
      Object.keys(formState.selectedLines).length > 0 ||
      Boolean(formState.reasonId || formState.clientDemandId || formState.attachments.length);
    if (!hasDraft) return undefined;

    const preventAccidentalClose = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', preventAccidentalClose);
    return () => window.removeEventListener('beforeunload', preventAccidentalClose);
  }, [claimNumber, formState, isHydrated]);

  useEffect(() => {
    if (!attachmentTypes.length || selectedAttachmentType) return;
    setSelectedAttachmentType(String(attachmentTypes[0].order));
  }, [attachmentTypes, selectedAttachmentType]);

  useEffect(() => {
    if (!flawsQuery.isSuccess) return;
    const availableIds = new Set(flaws.map((flaw) => flaw.id));
    setFormState((current) => {
      const availableSelection = current.flawIds.filter((id) => availableIds.has(id));
      if (availableSelection.length === current.flawIds.length) return current;
      setPageError('Список недостатков изменился. Проверьте выбранные значения.');
      return { ...current, flawIds: availableSelection };
    });
  }, [flaws, flawsQuery.isSuccess]);

  const setStep = (step: ClaimStep) => {
    setFormState((current) => ({ ...current, step }));
    setShowErrors(false);
    setPageError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilesSelected = (files: FileList) => {
    const attachmentType = attachmentTypes.find(
      (type) => String(type.order) === selectedAttachmentType,
    );
    const processedFingerprints = new Set<string>();

    for (const file of Array.from(files)) {
      const fingerprint = getFileFingerprint(file);
      const existing = formState.attachments.find(
        (attachment) => getAttachmentFingerprint(attachment) === fingerprint,
      );
      if (
        (existing && existing.status !== 'needs-file') ||
        processedFingerprints.has(fingerprint)
      ) {
        setPageError(`Файл «${file.name}» уже добавлен.`);
        continue;
      }

      const attachment: ClaimAttachment = {
        localId: existing?.localId ?? createLocalId(),
        fileName: file.name,
        size: file.size,
        mimeType: file.type || 'application/octet-stream',
        lastModified: file.lastModified,
        attachmentType: attachmentType?.type,
        attachmentTypeOrder: attachmentType?.order,
        attachmentTypeName: attachmentType?.name,
        status: 'selected',
        file,
      };
      processedFingerprints.add(fingerprint);
      setFormState((current) => ({
        ...current,
        attachments: existing
          ? current.attachments.map((item) =>
              item.localId === existing.localId ? attachment : item,
            )
          : [...current.attachments, attachment],
      }));
    }
  };

  const handleRemoveAttachment = (localId: string) => {
    setFormState((current) => ({
      ...current,
      attachments: current.attachments.filter((item) => item.localId !== localId),
    }));
  };

  const isStepValid = (step: ClaimStep) => {
    if (step === 0) {
      return (
        selectedLineIds.length > 0 &&
        selectedLineIds.every((lineId) => {
          const product = products.find((item) => item.lineId === lineId);
          const amount = formState.selectedLines[lineId];
          return Boolean(
            product &&
            Number.isInteger(amount) &&
            amount >= 1 &&
            amount <= Math.floor(product.amount),
          );
        })
      );
    }
    if (step === 1) {
      return Boolean(
        formState.reasonId &&
        formState.clientDemandId &&
        !reasonsQuery.isFetching &&
        !demandsQuery.isFetching &&
        !flawsQuery.isFetching &&
        !reasonsQuery.error &&
        !demandsQuery.error &&
        !flawsQuery.error &&
        (flaws.length === 0 || formState.flawIds.length > 0),
      );
    }
    if (step === 2) {
      const readyAttachments = formState.attachments.filter((item) => item.status !== 'needs-file');
      const requirementsMet = attachmentTypes.every(
        (type) =>
          readyAttachments.filter((item) => item.attachmentTypeOrder === type.order).length >=
          type.minAmount,
      );
      return Boolean(
        !attachmentTypesQuery.error &&
        !attachmentTypesQuery.isFetching &&
        requirementsMet &&
        !formState.attachments.some((item) => item.status === 'needs-file'),
      );
    }
    return true;
  };

  const handleNext = () => {
    if (!isStepValid(formState.step)) {
      setShowErrors(true);
      setPageError('Проверьте заполнение этого шага перед продолжением.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setStep((formState.step + 1) as ClaimStep);
  };

  const handleSubmit = async () => {
    setPageError('');
    const invalidStep = ([0, 1, 2] as ClaimStep[]).find((step) => !isStepValid(step));
    if (invalidStep !== undefined) {
      setFormState((current) => ({ ...current, step: invalidStep }));
      setShowErrors(true);
      setPageError('Проверьте заполнение обращения перед отправкой.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      const filesToUpload = formState.attachments.flatMap((attachment) =>
        attachment.status === 'selected' && attachment.file ? [attachment.file] : [],
      );

      if (filesToUpload.length > 0) {
        const attachmentResponse = await addAttachments({
          documentId,
          files: filesToUpload,
        }).unwrap();
        if (!attachmentResponse.success) throw new Error(attachmentResponse.error);

        setFormState((current) => ({
          ...current,
          attachments: current.attachments.map((attachment) =>
            attachment.status === 'selected'
              ? { ...attachment, status: 'uploaded', file: undefined }
              : attachment,
          ),
        }));
      }

      const response = await createClaim({
        documentId,
        lines: Object.entries(formState.selectedLines).map(([lineId, amount]) => ({
          lineId,
          amount,
        })),
        reasonId: formState.reasonId,
        clientDemandId: formState.clientDemandId,
        flawIds: formState.flawIds,
        attachments: formState.attachments
          .filter((attachment) => attachment.status !== 'needs-file')
          .map(({ lastModified: _lastModified, status: _status, file: _file, ...item }) => item),
      }).unwrap();
      if (!response.success) throw new Error(response.error);
      setClaimNumber(response.data.claimNumber);
      void configuration
        .removeConfiguration(getDraftKey(documentId))
        .catch(() => setDraftMessage('Претензия отправлена, но черновик удалить не удалось'));
    } catch (error: unknown) {
      setPageError(getRequestErrorMessage(error));
    }
  };

  if (!documentId) {
    return (
      <main className={s.statePage}>
        <section className={s.stateCard}>
          <span className={s.stateIcon} aria-hidden="true">
            !
          </span>
          <h1>Не указан документ</h1>
          <p>Откройте ссылку на возврат из заказа или сообщения от Askona.</p>
        </section>
      </main>
    );
  }

  if (documentQuery.isLoading || !isHydrated) {
    return (
      <main className={s.statePage} aria-busy="true">
        <section className={s.loadingCard}>
          <div className={s.logoMark} aria-hidden="true">
            a
          </div>
          <div className={s.spinner} />
          <h1>Открываем документ</h1>
          <p>Это займёт несколько секунд.</p>
        </section>
      </main>
    );
  }

  if (documentQuery.isError || !documentQuery.data?.success) {
    return (
      <main className={s.statePage}>
        <section className={s.stateCard}>
          <span className={s.stateIcon} aria-hidden="true">
            !
          </span>
          <h1>Не удалось открыть документ</h1>
          <p>{getRequestErrorMessage(documentQuery.error)}</p>
          <Button type="button" onClick={() => documentQuery.refetch()}>
            Попробовать снова
          </Button>
        </section>
      </main>
    );
  }

  if (claimNumber) {
    return (
      <ClaimResult
        claimNumber={claimNumber}
        onStartAgain={() => {
          setFormState(createEmptyClaimForm());
          setClaimNumber('');
          setDraftMessage('Черновик сохраняется автоматически');
        }}
      />
    );
  }

  const selectedReason = reasons.find((reason) => reason.id === formState.reasonId);
  const selectedDemand = demands.find((demand) => demand.id === formState.clientDemandId);
  const selectedFlaws = flaws.filter((flaw) => formState.flawIds.includes(flaw.id));

  return (
    <div className={s.page}>
      <header className={s.header}>
        <div className={s.headerInner}>
          <div className={s.brand} aria-label="Askona — возврат товаров">
            <span className={s.logoMark} aria-hidden="true">
              a
            </span>
            <span>
              <strong>Возврат товаров</strong>
              <small>{draftMessage}</small>
            </span>
          </div>
          <span className={s.secureBadge}>
            <span aria-hidden="true">◇</span> Данные защищены
          </span>
        </div>
        <nav className={s.progress} aria-label="Этапы оформления">
          {CLAIM_STEPS.map((label, index) => (
            <div
              className={`${s.progressStep} ${index <= formState.step ? s.progressStepActive : ''}`}
              aria-current={index === formState.step ? 'step' : undefined}
              key={label}
            >
              <span>{index + 1}</span>
              <small>{label}</small>
            </div>
          ))}
        </nav>
      </header>

      <main className={s.main}>
        {pageError && (
          <div className={s.pageAlert} role="alert">
            <span>{pageError}</span>
            <button type="button" aria-label="Закрыть сообщение" onClick={() => setPageError('')}>
              ×
            </button>
          </div>
        )}

        {formState.step === 0 && (
          <ProductStep
            products={products}
            selectedLines={formState.selectedLines}
            showErrors={showErrors}
            onToggle={(product) =>
              setFormState((current) => {
                const selectedLines = { ...current.selectedLines };
                if (selectedLines[product.lineId] !== undefined)
                  delete selectedLines[product.lineId];
                else selectedLines[product.lineId] = 1;
                return { ...current, selectedLines, flawIds: [] };
              })
            }
            onAmountChange={(product, amount) =>
              setFormState((current) => ({
                ...current,
                selectedLines: { ...current.selectedLines, [product.lineId]: amount },
              }))
            }
          />
        )}

        {formState.step === 1 && (
          <ClaimDetailsStep
            reasonId={formState.reasonId}
            clientDemandId={formState.clientDemandId}
            flawIds={formState.flawIds}
            reasons={{
              items: reasons,
              isLoading: reasonsQuery.isLoading,
              errorMessage: reasonsQuery.error
                ? getRequestErrorMessage(reasonsQuery.error)
                : undefined,
              retry: reasonsQuery.refetch,
            }}
            demands={{
              items: demands,
              isLoading: demandsQuery.isLoading,
              errorMessage: demandsQuery.error
                ? getRequestErrorMessage(demandsQuery.error)
                : undefined,
              retry: demandsQuery.refetch,
            }}
            flaws={{
              items: flaws,
              isLoading: flawsQuery.isFetching,
              errorMessage: flawsQuery.error ? getRequestErrorMessage(flawsQuery.error) : undefined,
              retry: flawsQuery.refetch,
            }}
            flawsEnabled={selectedLineIds.length > 0 && Boolean(formState.reasonId)}
            showErrors={showErrors}
            onReasonChange={(reasonId) =>
              setFormState((current) => ({ ...current, reasonId, flawIds: [] }))
            }
            onDemandChange={(clientDemandId) =>
              setFormState((current) => ({ ...current, clientDemandId }))
            }
            onFlawToggle={(flawId) =>
              setFormState((current) => ({
                ...current,
                flawIds: current.flawIds.includes(flawId)
                  ? current.flawIds.filter((id) => id !== flawId)
                  : [...current.flawIds, flawId],
              }))
            }
          />
        )}

        {formState.step === 2 && (
          <AttachmentsStep
            attachments={formState.attachments}
            attachmentTypes={attachmentTypes}
            selectedType={selectedAttachmentType}
            isTypesLoading={attachmentTypesQuery.isLoading}
            typesError={
              attachmentTypesQuery.error
                ? getRequestErrorMessage(attachmentTypesQuery.error)
                : undefined
            }
            showErrors={showErrors}
            onTypeChange={setSelectedAttachmentType}
            onFilesSelected={handleFilesSelected}
            onRetryTypes={attachmentTypesQuery.refetch}
            onRemoveAttachment={handleRemoveAttachment}
          />
        )}

        {formState.step === 3 && (
          <ReviewStep
            products={products}
            selectedLines={formState.selectedLines}
            reason={selectedReason}
            demand={selectedDemand}
            flaws={selectedFlaws}
            attachments={formState.attachments}
            onEdit={setStep}
          />
        )}
      </main>

      <footer className={s.actionBar}>
        <div className={s.actionBarInner}>
          {formState.step > 0 && (
            <Button
              type="button"
              variant="secondary"
              disabled={addAttachmentsState.isLoading || createClaimState.isLoading}
              onClick={() => setStep((formState.step - 1) as ClaimStep)}
            >
              Назад
            </Button>
          )}
          <Button
            className={s.nextButton}
            type="button"
            disabled={addAttachmentsState.isLoading || createClaimState.isLoading}
            onClick={formState.step === 3 ? () => void handleSubmit() : handleNext}
          >
            {addAttachmentsState.isLoading
              ? 'Загружаем файлы…'
              : createClaimState.isLoading
                ? 'Отправляем…'
                : formState.step === 3
                  ? 'Отправить претензию'
                  : 'Продолжить'}
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default ClaimFormPage;
