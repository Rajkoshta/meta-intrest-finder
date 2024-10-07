import { useState } from 'react';
import Switcher11 from './Switcher11'; // Importing the switcher component

const Header = ({ isChecked, setIsChecked }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="pb-6 bg-white lg:pb-0">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                {/* lg+ */}
                <nav className="flex items-center justify-between h-16 lg:h-20">
                    <div className="flex-shrink-0">
                        <a href="#" title="" className="flex">
                            <img
                                className="w-auto h-10 lg:h-10"
                                src="https://mbgcard.in/wp-content/uploads/WhatsApp_Image_2023-05-03_at_12.29.05_PM-removebg-preview.png"
                                alt="Logo"
                            />
                        </a>
                    </div>

                    {/* Add Switcher11 in the center */}
                    <div className="flex justify-center">
                        <Switcher11 isChecked={isChecked} setIsChecked={setIsChecked} />
                    </div>

                    {/* "Get started now" button */}
                    <a
                        href="#"
                        title=""
                        className="items-center justify-center hidden px-4 py-3 ml-10 text-base font-semibold text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-md lg:inline-flex hover:bg-blue-700 focus:bg-blue-700"
                        role="button"
                    >
                        Get started now
                    </a>
                </nav>

                {/* xs to lg */}
                {isMenuOpen && (
                    <nav className="pt-4 pb-6 bg-white border border-gray-200 rounded-md shadow-md lg:hidden">
                        <div className="flow-root">
                            <div className="flex flex-col px-6 -my-2 space-y-1">
                                {/* Add any mobile-specific links or keep it minimal */}
                            </div>
                        </div>

                        <div className="px-6 mt-6">
                            <a
                                href="#"
                                title=""
                                className="inline-flex justify-center px-4 py-3 text-base font-semibold text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-md items-center hover:bg-blue-700 focus:bg-blue-700"
                                role="button"
                            >
                                Get started now
                            </a>
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
};

export default Header;
