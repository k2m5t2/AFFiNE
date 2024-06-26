import {
  NoPermissionOrNotFound,
  NotFoundPage,
} from '@affine/component/not-found-page';
import { useSession } from '@affine/core/hooks/affine/use-current-user';
import { useAsyncCallback } from '@affine/core/hooks/affine-async-hooks';
import type { ReactElement } from 'react';
import { useCallback, useState } from 'react';

import { SignOutModal } from '../components/affine/sign-out-modal';
import { RouteLogic, useNavigateHelper } from '../hooks/use-navigate-helper';
import { signOutCloud } from '../utils/cloud-utils';
import { SignIn } from './sign-in';

export const PageNotFound = ({
  noPermission,
}: {
  noPermission?: boolean;
}): ReactElement => {
  const { user } = useSession();
  const { jumpToIndex } = useNavigateHelper();
  const { reload } = useSession();
  const [open, setOpen] = useState(false);

  const handleBackButtonClick = useCallback(
    () => jumpToIndex(RouteLogic.REPLACE),
    [jumpToIndex]
  );

  const handleOpenSignOutModal = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  const onConfirmSignOut = useAsyncCallback(async () => {
    setOpen(false);
    await signOutCloud();
    await reload();
  }, [reload]);
  return (
    <>
      {noPermission ? (
        <NoPermissionOrNotFound
          user={user}
          onBack={handleBackButtonClick}
          onSignOut={handleOpenSignOutModal}
          signInComponent={<SignIn />}
        />
      ) : (
        <NotFoundPage
          user={user}
          onBack={handleBackButtonClick}
          onSignOut={handleOpenSignOutModal}
        />
      )}

      <SignOutModal
        open={open}
        onOpenChange={setOpen}
        onConfirm={onConfirmSignOut}
      />
    </>
  );
};

export const Component = PageNotFound;
