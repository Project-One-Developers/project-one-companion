export default function HomePage(): JSX.Element {
    return (
        <>
            <div className="flex flex-col items-center w-full justify-center mt-10 mb-10">
                <div>
                    <img
                        className="ml-auto mr-auto"
                        src="./assets/logo.png"
                        alt="Logo image"
                        width={256}
                        height={256}
                    />
                </div>
            </div>
        </>
    )
}
