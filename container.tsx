'use client'

import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import _ from "lodash"
import General from "./General"

// Define the validation schema for the file upload
const validationSchema = {
    required: "File is required",
    validate: {
        isJson: (file) => file.type === "application/json" || "File must be a JSON file",
    },
}

// Define the Container component
function Container() {
    // Use the useForm hook to manage the file upload state and validation
    const { register, handleSubmit, formState: { errors } } = useForm()

    // Use the useState hook to manage the JSON data state
    const [jsonData, setJsonData] = useState(null)

    // Use the useState hook to manage the form values state
    const [formValues, setFormValues] = useState({})

    // Use the useEffect hook to update the form values when the JSON data changes
    useEffect(() => {
        // Clone the JSON data and merge it with the form values
        const newFormValues = _.merge(_.cloneDeep(jsonData), formValues)

        // Set the form values state with the new form values
        setFormValues(newFormValues)
    }, [jsonData]);


    function fileCallback(e) {
        var fileString = e.target.result;
        var json = JSON.parse(fileString);
        console.log(json);
        setJsonData(json);
    }

    // Define the onSubmit function for the file upload
    function onSubmit() {
        console.log('Started');
        var input = document.getElementById('file')
        var reader = new FileReader();
        reader.onload = (e) => fileCallback(e);
        reader.readAsText(input.files[0])
        
    }

    // Return the JSX code for the component
    return (
        <div className="w-4/5 max-w-xl mx-auto my-8 p-8 border border-gray-300 rounded-lg shadow-lg bg-white">
            <h1 className="text-3xl text-green-600">Create/Edit Endpoint</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                <label
                    htmlFor="file"
                    className="block text-lg font-bold mb-2 text-gray-700"
                >
                    Upload a JSON file
                </label>
                <input
                    id="file"
                    name="file"
                    type="file"
                    accept="application/json"
                    {...register("file", validationSchema)}
                    className="block w-full py-2 px-4 text-black border border-gray-300 rounded-md outline-none focus:border-green-600"
                />
                {errors.file && (
                    <div className="text-sm text-red-600 mt-1">
                        {errors.file.message}
                    </div>
                )}
                <button
                    onClick={(e) => onSubmit(e)}
                    type="submit"
                    className="block w-full py-3 px-4 bg-green-600 text-white font-bold rounded-md cursor-pointer mt-4"
                >
                    Upload
                </button>
            </form>
            {jsonData && (
                <General formValues={formValues} setFormValues={setFormValues} />
            )}
        </div>


    )
}

// Export the Container component
export default Container
