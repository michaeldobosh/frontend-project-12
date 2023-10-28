import AddChannel from './AddChannel.jsx';
import RemoveChannel from './RemoveChannel.jsx';
import RenameChannel from './RenameChannel.jsx';

const modals = {
  newChannel: AddChannel,
  removeChannel: RemoveChannel,
  renameChannel: RenameChannel,
};

const renderModal = (socket, handleClose, modalsInfo) => {
  if (!modalsInfo.action) return null;

  const Component = modals[modalsInfo.action];
  return <Component socketApi={socket} handleClose={handleClose} modalsInfo={modalsInfo} />;
};

export default renderModal;
