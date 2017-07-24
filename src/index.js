import { compose } from 'ramda';

import withSwipeToDismiss from './decorators/withSwipeToDismiss';
import withBackdrop from './decorators/withBackdrop';
import ModalBase from './components/ModalBase';

const Modal = compose(withBackdrop, withSwipeToDismiss)(ModalBase);

export default Modal;
export { ModalBase, withBackdrop, withSwipeToDismiss };
