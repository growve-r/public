'use client'

import React, { useRef, useState, useEffect, useReducer } from 'react';
import { CommandLineIcon, ChevronRightIcon, QuestionMarkCircleIcon, LockOpenIcon, LockClosedIcon, QueueListIcon } from '@heroicons/react/24/outline';
import { useDropzone } from 'react-dropzone';
import Dropzone from 'react-dropzone';
import { Transition, Tab, Disclosure } from '@headlessui/react';
import pageReducer from './pageReducer';
import { Tooltip } from 'react-tooltip';
import * as types from './Types';

function Endpoints(props: types.EndpointsProps) {
    if (Object.keys(props.manager).includes('data') && props.manager.group === 'Endpoints') {
        return (
            props.manager.data.map((endpoint, idx) => {
                return (
                    <button key={`${endpoint.name}_${idx}`} className='flex max-w-lg rounded-lg p-3 m-2 bg-[#61a60e] text-white align-middle' onClick={() => { props.dispatch({ type: 'setEndpoint', endpoint: idx }); props.dispatch({ type: 'setGroup', group: 'General' }) }}>
                        <div className='flex flex-col h-full w-full align-middle self-center'>
                            {endpoint.name}
                        </div>
                        <ChevronRightIcon className='w-6 h-6 m-3 text-white align-self-center' />
                    </button>
                )
            })
        )
    } else {
        return (null);
    }
};
function TextField(props: types.TextFieldProps) {
    const [lock, setLock] = useState(true);

    return (
        <div className="sm:col-span-4 px-3 last:pb-6">
            <label htmlFor={props.id} className="flex text-sm font-medium align-middle leading-6 text-gray-900">
                {props.label }
                <QuestionMarkCircleIcon className='hover:text-[#ff8300] text-gray-400 h-5 w-5 ml-3' data-tooltip-id={props.tooltipId} data-tooltip-content={props.tooltipContent} />
            </label>
            <div className="mt-2">
                <div className="grid grid-cols-12 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-lg">

                    <input
                        type="text"
                        disabled={lock}
                        name={props.name}
                        value={props.value}
                        onChange={props.onChange}
                        id={props.id}
                        className="block col-span-11 flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 disabled:bg-gray-100"
                    />
                    <button
                        className={lock ? 'text-black p-3 bg-gray-100 h-full w-full justify-self-end' : 'text-black p-3 h-full w-full justify-self-end'}
                        onClick={() => { setLock(prev => !prev); } }
                    >
                        {lock ? <LockClosedIcon className='h-3 w-3 text-black bg-gray-100'  /> : <LockOpenIcon className='h-3 w-3 text-black' /> }
                    </button>
                </div>
            </div>
        </div>
    )
};
function TextArea(props: types.TextFieldProps) {
    const [lock, setLock] = useState(true);

    return (
        <div className="sm:col-span-4 px-3 last:pb-6">
            <label htmlFor={props.id} className="flex text-sm font-medium align-middle leading-6 text-gray-900">
                {props.label}
                <QuestionMarkCircleIcon className='hover:text-[#ff8300] text-gray-400 h-5 w-5 ml-3' data-tooltip-id={props.tooltipId} data-tooltip-content={props.tooltipContent} />
            </label>
            <div className="mt-2">
                <div className="grid grid-cols-12 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-lg">

                    <textarea
                        type="text"
                        disabled={lock}
                        name={props.name}
                        value={props.value}
                        onChange={props.onChange}
                        id={props.id}
                        className="block col-span-11 flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 disabled:bg-gray-100"
                    />
                    <button
                        className={lock ? 'text-black p-3 bg-gray-100 h-full w-full justify-self-end' : 'text-black p-3 h-full w-full justify-self-end'}
                        onClick={() => { setLock(prev => !prev); }}
                    >
                        {lock ? <LockClosedIcon className='h-3 w-3 text-black bg-gray-100' /> : <LockOpenIcon className='h-3 w-3 text-black' />}
                    </button>
                </div>
            </div>
        </div>
    )
};

function BoolField(props: types.BoolFieldProps) {
    return (
        <div className="flex items-center gap-x-3">
            <input
                id={props.id}
                name={props.name}
                value={props.value}
                onChange={props.onChange}
                type="checkbox"
                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
            <label htmlFor={props.id} className="block text-sm font-medium leading-6 text-gray-900">
                {props.label}
                <QuestionMarkCircleIcon className='hover:text-[#ff8300] text-gray-400 h-5 w-5 ml-3' data-tooltip-id={props.tooltipId} data-tooltip-content={props.tooltipContent} />
            </label>
        </div>
    )
};

function Dropdown(props: types.DropdownProps) {
    return (
        <div className="sm:col-span-3">
            <label htmlFor={props.id} className="block text-sm font-medium leading-6 text-gray-900">
                Country
            </label>
            <div className="mt-2">
                <select
                    id={props.id}
                    name={props.name}
                    value={props.value}
                    onChange={props.onChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                >
                    {props.options.map((option, idx) => {
                        return (
                            <option key={`${option}_${idx}`} value={option}>{option}</option>
                        );
                    })};
                </select>
            </div>
        </div>
    )
}

function FieldDisclosure(props: types.FieldDisclosureProps) {
    return (
        <Disclosure>
            <Disclosure.Button>
                {props.name}
            </Disclosure.Button>
            <Disclosure.Panel>
                {props.children}
            </Disclosure.Panel>
        </Disclosure>
    )
};
function Headers(props: types.ManagementProps) {
    if (Object.keys(props.manager).includes('data') && ![undefined, null].includes(props.manager.endpoint)) {
        console.log(`Endpoint = ${props.manager.endpoint}`)
        console.log(props.manager.data[0]);
        return (
            Object.keys(props.manager.data[props.manager.endpoint].headerFields).map((field, idx) => {    
                return (<HeaderItem endpoint={props.manager.data[idx][field].name index={idx} />)
            }
            )
        )
    } else {
        return (null);
    }
}

function HeaderItem(props: types.HeaderProps) {
    const tooltipMap = {
        required: 'Is this field required for a successful response?',
        type: "What type should this field's value be?",
        format: "Format required for string. Used primarily for date fields",
        doc: ""

    }
    if (Object.keys(props.manager).includes('data') && ![undefined, null].includes(props.manager.data)) {
        return (
            <Disclosure>
                <Disclosure.Button className={props.manager.endpoint === props.field ? 'bg-[#61a60e]/80 rounded-xl text-white flex' : 'hidden'}>
                    {props.field} <ChevronRightIcon className='text-white ml-3 justify-self-end'/>
                </Disclosure.Button>
                <Disclosure.Panel>
                    <div className={props.show ? "mt-10 grid grid-cols-1 justify-items-center gap-x-6 gap-y-8 pb-3" : "hidden"}>
                        <BoolField field={props.field} id={`${props.field}_required`} label='Required' tooltipId={`headers_${props.field}`} tooltipContent={tooltipMap.required} name={`${props.field}_required`} manager={props.manager} value={props.manager.data[props.field]} />
                        <Dropdown field={props.field}  id={`${props.field}_type`} options={['string', 'int', 'bool', 'array[string]', 'array[int]', 'array[object]', 'array[bool]']} label='Type' tooltipId='headers' tooltipContent={tooltipMap.type} name='endpoint-route' value={props.manager.data[props.index].endpoint} onChange={(e) => props.dispatch({ type: 'updateGeneral', value: e.target.value, field: 'endpoint' })} />
                        <TextField field={props.field} id={`${props.field}_format`} label='Format' tooltipId={`headers_${props.field}`} tooltipContent={tooltipMap.format} name='endpoint-baseurl' value={props.manager.data[props.index].baseURL} onChange={(e) => props.dispatch({ type: 'updateGeneral', value: e.target.value, field: 'baseURL' })} id={`{` } />
                        <TextField field={props.field} id={`${props.field}_required`} label='Version' tooltipId={`headers_${props.field}`} tooltipContent={tooltipMap.version} name='endpoint-version' value={props.manager.data[props.index].version} onChange={(e) => props.dispatch({ type: 'updateGeneral', value: e.target.value, field: 'version' })} />
                        <TextField field={props.field} id={`${props.field}_required`} label='Description' tooltipId={`headers_${props.field}`} tooltipContent={tooltipMap.description} name='endpoint-description' value={props.manager.data[props.index].description} onChange={(e) => props.dispatch({ type: 'updateGeneral', value: e.target.value, field: 'description' })} />
                        <Tooltip style={{ width: '15rem', wordWrap: 'break-word' }} id={`headers_${props.field}` } />
                    </div>
                </Disclosure.Panel>
            </Disclosure>
            )
    } else {
        return (null);
    };
}


function General(props: types.GeneralProps) {
    const tooltipMap = {
        name: 'Name of the endpoint. This will be used to name the class method.',
        endpoint: 'Endpoint route. i.e. "/api/python" in api.growve.tools:8393/api/python. If the path is uses a variable, wrap the variable in curly brackets.',
        baseurl: 'Base URL for endpoint. i.e. "api.growve.tools:8393" in api.growve.tools:8393/api/python',
        version: 'API Version. If none, enter "None"',
        description: 'What does this endpoint do?',
        limit: "Rate limiting of requrests"
    };
    if (Object.keys(props.manager).includes('data') && ![undefined, null].includes(props.manager.data)) {
        return (
            <Transition
                as={'div'}
                show={Object.keys(props.manager).includes('group') && props.manager.group === 'General'}
                enter={'transition transform duration-[400ms]'}
                enterFrom={'scale-0'}
                enterTo={'scale-100'}
                leave={'duration-[400ms]'}
                leaveFrom={'scale-100'}
                leaveTo={'scale-0'}
            >
                <div className={props.show ? "mt-10 grid grid-cols-1 justify-items-center gap-x-6 gap-y-8 pb-3 overflow-y-auto max-h-[90%]" : "hidden"}>
                    <TextField fieldName='name' label='Name' tooltipId='general' tooltipContent={tooltipMap.name} name='endpoint-name' manager={props.manager} value={props.manager.data[props.index].name } />
                    <TextField fieldName='endpoint' label='Route' tooltipId='general' tooltipContent={tooltipMap.endpoint} name='endpoint-route' value={props.manager.data[props.index].endpoint} onChange={(e) => props.dispatch({ type: 'updateGeneral', value: e.target.value, field: 'endpoint' })} />
                    <TextField fieldName='baseURL' label='Base URL' tooltipId='general' tooltipContent={tooltipMap.baseurl} name='endpoint-baseurl' value={props.manager.data[props.index].baseURL} onChange={(e) => props.dispatch({ type: 'updateGeneral', value: e.target.value, field: 'baseURL' })} />
                    <TextField fieldName='version' label='Version' tooltipId='general' tooltipContent={tooltipMap.version} name='endpoint-version' value={props.manager.data[props.index].version} onChange={(e) => props.dispatch({ type: 'updateGeneral', value: e.target.value, field: 'version' })} />
                    <TextField fieldName='description' label='Description' tooltipId='general' tooltipContent={tooltipMap.description} name='endpoint-description' value={props.manager.data[props.index].description} onChange={(e) => props.dispatch({ type: 'updateGeneral', value: e.target.value, field: 'description' })} />
                    <TextField fieldName='limit' label='Rate Limit' tooltipId='general' tooltipContent={tooltipMap.limit} name='endpoint-limit' value={props.manager.data[props.index].limit } />
                    <Tooltip style={{ width: '15rem', wordWrap: 'break-word' }} id='general' />
                </div>
            </Transition>
        );
    } else {
        return (null);
    };
    
}
function GroupNav(props: types.GroupNavProps) {
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    };
    const [categories] = useState(['General', 'Headers', 'Parameters', 'Body', 'Path']);
    return (
        <Transition
            as={'div'}
            className='top-0 w-full h-full justify-self-center justify-center flex flex-col items-center '
            show={props.manager.display.form}
            enter={'transition transform duration-[400ms] delay-[400ms]'}
            enterFrom={'scale-0'}
            enterTo={'scale-100'}
            leave={'duration-[400ms]'}
            leaveFrom={'scale-100'}
            leaveTo={'scale-0'}
        >
            <div className="w-full max-w-lg px-2 sm:px-0">
                <div
                    onClick={() => { props.dispatch({ type: 'setGroup', group: 'Endpoints' }); props.dispatch({ type: 'setEndpoint', endpoint: null}); } }
                    className='flex space-x-1 rounded-t-xl bg-gray-800/20 font-bold text-center justify-center p-3 text-[#ff8300] items-center'
                >
                    {!Object.keys(props.manager).includes('endpoint') || props.manager.endpoint === null ? 'Endpoints' : props.manager.data[props.manager.endpoint].name} <QueueListIcon onClick={() => props.dispatch({ type: 'setGroup', group: 'endpoints' })} className='text-[#ff8300] w-4 h-4 ml-3 hover:cursor-pointer' />
                </div>
                <Tab.Group>
                    <Tab.List className="flex space-x-1 bg-gray-800/20 p-1 rounded-b-none">
                        {categories.map(cat => {
                            return (
                                <Tab
                                    disabled={!['General', 'Headers', 'Parameters', 'Body', 'Path'].includes(props.manager.group)}
                                    key={cat}
                                    onClick={() => props.dispatch({type: 'setGroup', group: cat}) }
                                    className={({ selected }) =>
                                        classNames(
                                            'w-[12ch] first:rounded-l-lg last:rounded-r-lg py-2.5 text-sm font-bold leading-5 disabled:bg-gray-200 disabled:text-white',
                                            'ring-[#ff8300]/80 ring-offset ring-offset-[#ff8300] focus:outline-none focus:ring-2',
                                            selected
                                                ? 'bg-white text-[#ff8300] shadow'
                                                : 'text-[#ff8300] hover:bg-white/[0.12] hover:text-white'
                                        )
                                    }
                                >
                                    {cat}
                                </Tab>
                            )
                        }) }
                    </Tab.List>
                </Tab.Group>
                <Tab.Group>
                    <Tab.List className="flex space-x-1 bg-gray-800/20 p-1 rounded-b-none">
                    </Tab.List>
                </Tab.Group>
                
            </div>
            <div className='h-full overflow-y-auto w-full max-w-lg border rounded-b-xl border-2 border-gray-800/20'>
                {props.children}
            </div>
        </Transition>
    )
}

function DocUpload(props: types.ManagementProps) {
    const { getRootProps, getInputProps, isDragActive } = useDropzone();
    const [file, setFile] = useState(null);
    function getFile(e, drag: boolean) {
        if (drag) {
            e.preventDefault();
            if (e.dataTransfer.items) {
                setFile(e.dataTransfer.items[0].getAsFile());
                return;
            } else {
                return;
            }
        } else {
            if (process.browser) {
                var input = document.getElementById('json-upload').files[0];
                setFile(input);
                return;
            } else {
                return;
            }
        }
        
        
    };

    function uploadFile() {
        var form = new FormData();
        form.append('file', file);
        fetch('/api/transformFile', { method: 'POST', body: form })
            .then(response => {
                return response.json();
            })
            .then(json => {
                props.dispatch({ type: 'initialize', data: json.endpoints });
                props.dispatch({type: 'setGroup', group: 'Endpoints'})
            })
    }
    return (
        <Transition
            as={'div'}
            show={props.manager.display.upload}
            enter={'transition transform duration-[400ms] flex justify-center'}
            enterFrom={'scale-0 flex justify-center'}
            enterTo={'scale-100 flex justify-center'}
            leave={'duration-[400ms] flex justify-center'}
            leaveFrom={'scale-100 flex justify-center'}
            leaveTo={'scale-0 flex justify-center'}
            >
            <Dropzone>
                {({ getRootProps, getInputProps, isDragActive }) => (
                    <div {...getRootProps()} onClick={null}>
                        <div onClick={null} className="text-center bg-[#61a60e] rounded-lg outline-2 outline-dashed outline-gray-300" onDrop={(e) => getFile(e, true)}>
                            <div onClick={null} className='p-24' onDropCapture={(e) => getFile(e, true)}>
                                <CommandLineIcon className="mx-auto h-12 w-12 text-white/90" aria-hidden="true" onDropCapture={(e) => getFile(e, true)} />
                                <div className="mt-4 flex text-sm leading-6 text-white/80 h-full w-full" onDropCapture={(e) => getFile(e, true)}>
                                    <label
                                        htmlFor="json-upload"
                                        className="relative cursor-pointer rounded-md font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-gray-300 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-gray-300"
                                    >Upload a file
                                        <input {...getInputProps()} id="json-upload" name="file-upload" type="file" className="sr-only h-full w-full" accept='application/json' onChange={(e) => getFile(e, false)} onDropCapture={(e) => getFile(e, true)} />
                                    </label>
                                    <p className="pl-1">or drag and drop JSON (any size)</p>
                                </div>
                                <p className="text-xs leading-5 text-white/80"></p>
                                <button onClick={() => uploadFile() } className={file === null ? 'hidden' : 'bg-white text-[#61a60e] p-3 rounded-lg mt-6'}>{file === null ? '' : `Use ${file.name}`} </button>
                            </div>
                        </div>
                    </div>
                ) }  
            </Dropzone>
        </Transition>
    );
};



export default function APIForm() {
    const [manager, dispatch] = useReducer(pageReducer, {
        display: {
            upload: true,
            form: false
        }
    });
    const [endpoints, setEndpoints] = useState(null);
    const [isShowing, setIsShowing] = useState(false);
    function logData(results) {
        console.log(results);
    };

    function loadEndpoints(file) {
        var form = new FormData();
        form.append('file', file);
        fetch('/api/transformFile', { method: 'POST', mode: 'cors', body: form })
            .then(response => {
                return response.json();
            })
            .then(json => {
                setEndpoints(json.endpoints);
            })
    }

    return (
        <div className='grid h-full min-h-screen w-full justify-items-center content-center bg-white mx-auto'>
            <DocUpload manager={manager} dispatch={dispatch} />
            <GroupNav manager={manager} dispatch={dispatch}>
                <Endpoints manager={manager} dispatch={dispatch} />
                <General show={manager.group === 'General'} index={0} manager={manager} dispatch={dispatch} />
                <Headers show={manager.group === 'Headers'} manager={manager} dispatch={dispatch} />
            </GroupNav>
            {/*<TreeNodeIcon>*/}
            {/*    <button className='bg-green-400 p-4 rounded-xl text-white' onClick={() => dispatch({ type: 'display', component: 'upload' })}>Click Me</button>*/}
            {/*</TreeNodeIcon>*/}
            
        </div>
    )
}

