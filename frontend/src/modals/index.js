import AddChannel from './AddChannel.jsx';
import RemoveChannel from './RemoveChannel.jsx';
import RenameChannel from './RenameChannel.jsx';

const modals = {
  newChannel: AddChannel,
  removeChannel: RemoveChannel,
  renameChannel: RenameChannel,
};

export default (modalName) => modals[modalName];
