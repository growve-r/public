<div className="w-4/5 max-w-xl mx-auto my-8 p-8 border border-gray-300 rounded-lg shadow-lg">
            <h1 className="text-3xl text-blue-600">Create/Edit Endpoint</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                <label
                    htmlFor="file"
                    className="block text-lg font-bold mb-2"
                >
                    Upload a JSON file
                </label>
                <input
                    id="file"
                    name="file"
                    type="file"
                    accept=".json"
                    {...register("file", validationSchema)}
                    className="block w-full py-2 px-4 border border-gray-300 rounded-md outline-none focus:border-blue-600"
                />
                {errors.file && (
                    <div className="text-sm text-red-600 mt-1">
                        {errors.file.message}
                    </div>
                )}
                <button
                    type="submit"
                    className="block w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-md cursor-pointer mt-4"
                >
                    Upload
                </button>
            </form>
            {jsonData && (
                <General formValues={formValues} setFormValues={setFormValues} />
            )}
        </div>
