import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ModalPropsShared } from './types';

const FullPageModal: React.FC<ModalPropsShared> = ({
  isOpen,
  title,
  description,
  closeModal,
  children,
}) => {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto text-white"
        onClose={closeModal}
      >
        <section className={`min-h-screen text-center  h-100`}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0" />
          </Transition.Child>
          <span className={`inline-block`} aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div
              className={`inline-block min-h-screen w-full max-w-md px-3 py-2 text-left align-middle transition-all transform bg-slate-900`}
            >
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-white pr-4"
              >
                {title}
              </Dialog.Title>
              {description && (
                <Dialog.Description
                  as="p"
                  className="mt-2 text-sm leading-5 text-white"
                >
                  {description}
                </Dialog.Description>
              )}
              {children}
            </div>
          </Transition.Child>
        </section>
      </Dialog>
    </Transition>
  );
};

export default FullPageModal;
