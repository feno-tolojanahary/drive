import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { 
    FaEdit,
    FaTrashAlt,
    FaPlay,
    FaDownload
} from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { DocumentRow, DocType } from '../../../server/src/common/interfaces/document';
import { isVideoFile } from "../../../server/src/common/helper";
import { Action } from '../../interfaces/general';

type propsType = { 
    onClick: (eventName: Action, doc: DocumentRow) => void,
    doc: DocumentRow
}

export default function DropdownAction({
  onClick,
  doc
}: propsType) {
  return (
    <div className="fixed top-16 w-56 text-right">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex w-full justify-center rounded-md bg-opacity-20 px-1 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            <BsThreeDotsVertical
              className="ml-2 -mr-1 h-5 w-5 text-gray-900"
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg text-gray-900 focus:outline-none">
            <div className="px-1 py-1 ">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-300' : ''
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    onClick={() => onClick("update", doc)}
                  >
                    <FaEdit
                      className="mr-2 h-5 w-5"
                      aria-hidden="true"
                    />
                    Rename
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-300' : ''
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900`}
                    onClick={() => onClick("remove", doc)}
                  >
                      <FaTrashAlt
                        className="mr-2 h-5 w-5"
                        aria-hidden="true"
                      />
                    Delete
                  </button>
                )}
              </Menu.Item>
            </div>
            <div className="px-1 py-1 ">
              { doc.type === DocType.FILE && isVideoFile(doc.name) &&
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-gray-300' : ''
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900`}
                      onClick={() => onClick("play", doc)}
                    >
                        <FaPlay
                          className="mr-2 h-5 w-5"
                          aria-hidden="true"
                        />
                      Play
                    </button>
                  )}
                </Menu.Item>
              }
            </div>
            <div className="px-1 py-1 ">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-300' : ''
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900`}
                    onClick={() => onClick("download", doc)}
                  >
                      <FaDownload
                        className="mr-2 h-5 w-5"
                        aria-hidden="true"
                      />
                    Download
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}