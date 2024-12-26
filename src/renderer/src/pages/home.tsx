import React from 'react'

export default function HomePage(): JSX.Element {
    return (
        <React.Fragment>
            <div className="flex flex-col items-center w-full justify-center mt-10 mb-10">
                <div>
                    <img
                        className="ml-auto mr-auto"
                        src="/public/images/logo.png"
                        alt="Logo image"
                        width={256}
                        height={256}
                    />
                </div>
            </div>
        </React.Fragment>
    )
}
