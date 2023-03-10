import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { 
    FaFolderPlus, 
    FaAngleDown,
    FaFileUpload
} from "react-icons/fa";

type propsType = {
    onClickFolder: React.MouseEventHandler<HTMLButtonElement>,
    onClickFile: React.MouseEventHandler<HTMLButtonElement>
}

export default function MenuDropdown({
  onClickFolder,
  onClickFile
}: propsType) {
  return (
    <div className="fixed top-16 w-56 text-right">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-300 text-gray-900 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            New
            <FaAngleDown
              className="ml-2 -mr-1 h-5 w-5"
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
                    onClick={onClickFolder}
                  >
                    <FaFolderPlus
                      className="mr-2 h-5 w-5"
                      aria-hidden="true"
                    />
                    New Folder
                  </button>
                )}
              </Menu.Item>
            </div>
            <div className="px-1 py-1 ">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-300' : ''
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    onClick={onClickFile}
                  >
                    <FaFileUpload
                      className="mr-2 h-5 w-5"
                      aria-hidden="true"
                    />
                    Upload File
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