import React from 'react';

const Map = () => {
    return (
        <section className="text-gray-600 body-font relative">
            <div className="rounded-xl h-[600px] bg-muted relative">
                <div className="container px-5 py-15 sm:px-0 mx-auto h-full">
                    <div className="w-full h-full bg-gray-300 rounded-lg overflow-hidden p-10 relative">
                        {/* Full-height iframe */}
                        <iframe
                            width="100%"
                            height="100%"
                            className="absolute inset-0 h-full w-full"
                            title="map"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.6904435576153!2d85.36490402538037!3d27.665047577356!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1a08deaac20d%3A0x2c994399b80e4bda!2sBalkot%20Chowk%2C%20Anantalingeshwar%2044600!5e0!3m2!1sen!2snp!4v1711943408541!5m2!1sen!2snp">
                        </iframe>

                        {/* Contact Info */}
                        <div className="bg-white absolute bottom-5 left-5 flex flex-col py-6 pr-24 rounded shadow-md z-10">
                            <div className="px-6">
                                <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">ADDRESS</h2>
                                <p className="mt-1">Near Balkot Chowk, Kausaltar</p>
                            </div>
                            <div className="px-6 mt-4">
                                <h2 className="title-font font-semibold text-gray-900 text-xs">EMAIL</h2>
                                <a className="text-indigo-500 leading-relaxed">shresthaprajjwol4@email.com</a>
                                <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs mt-4">PHONE</h2>
                                <p className="leading-relaxed">9803600040</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Map;
