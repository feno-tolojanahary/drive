import React from "react";
import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'

type propsType = {
    title?: string,
    children: React.ReactNode,
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

function Modal({
    title,
    children,
    isOpen,
    setIsOpen
}: propsType) {

  return (
    <Transition
      show={isOpen}
      enter="transition duration-100 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
      as={Fragment}
    >
      <Dialog onClose={() => setIsOpen(false)}>
        <Dialog.Panel>
          {title && <Dialog.Title>{title}</Dialog.Title>}
          {children}
        </Dialog.Panel>
      </Dialog>
    </Transition>
  )
}

export default Modal;