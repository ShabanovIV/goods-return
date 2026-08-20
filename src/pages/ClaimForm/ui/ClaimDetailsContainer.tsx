import { ClaimDetailsStep } from 'src/features/SpecifyClaimDetails';
import { getRequestErrorMessage } from '../lib/getRequestErrorMessage';
import { useClaimData } from '../model/useClaimData';
import { useClaimFormState } from '../model/useClaimFormState';

type ClaimDetailsContainerProps = {
  data: ReturnType<typeof useClaimData>;
  state: ReturnType<typeof useClaimFormState>;
};

export const ClaimDetailsContainer = ({ data, state }: ClaimDetailsContainerProps) => (
  <ClaimDetailsStep
    reasonId={state.formState.reasonId}
    clientDemandId={state.formState.clientDemandId}
    flawId={state.formState.flawId}
    reasons={{
      items: data.reasons,
      isLoading: data.reasonsQuery.isLoading,
      errorMessage: data.reasonsQuery.error
        ? getRequestErrorMessage(data.reasonsQuery.error)
        : undefined,
      retry: data.reasonsQuery.refetch,
    }}
    demands={{
      items: data.demands,
      isLoading: data.demandsQuery.isLoading,
      errorMessage: data.demandsQuery.error
        ? getRequestErrorMessage(data.demandsQuery.error)
        : undefined,
      retry: data.demandsQuery.refetch,
    }}
    flaws={{
      items: data.flaws,
      isLoading: data.flawsQuery.isFetching,
      errorMessage: data.flawsQuery.error
        ? getRequestErrorMessage(data.flawsQuery.error)
        : undefined,
      retry: data.flawsQuery.refetch,
    }}
    flawsEnabled={data.selectedLineIds.length > 0 && Boolean(state.formState.reasonId)}
    showErrors={state.showErrors}
    onReasonChange={(reasonId) =>
      state.setFormState((current) => ({ ...current, reasonId, flawId: '' }))
    }
    onDemandChange={(clientDemandId) =>
      state.setFormState((current) => ({ ...current, clientDemandId }))
    }
    onFlawChange={(flawId) => state.setFormState((current) => ({ ...current, flawId }))}
  />
);
