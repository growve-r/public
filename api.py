import requests
import hmac
import hashlib
import datetime
import json
import time

class Field(object):
    def __init__(self, field: dict, name: str):
        self.required = field['required']
        self.name = name
        self.type = field['type']
        self.__doc = field['doc']
        self.document = True if field['doc'] != False else False
        self.default = field['default'] if 'default' in field.keys() else None
        self.__values = field['values'] if 'values' in field.keys() else None
        self.children = self.__getChildren(field['children']) if 'children' in field.keys() and field['type'] in ['array', 'object'] else None
        self.__format = field['format'] if 'format' in field.keys() else None
        self.__memberType = field['type'].replace('array[', '').replace(']', '') if 'array' in field['type'] else None
        
    
    def docstring(self, spacing: str = ''):
        name = f"\n {spacing}\033[1m {self.name}{'*' if self.required else ''}\033[0m \n"
        typ = f"{spacing}    \033[1m - type: {self.type} \033[0m \n"
        values = f"   {spacing} \033[1m - values:\033[0m {self.__values} \n" if self.__values != None else ""
        default = f"  {spacing}  \033[1m - default:\033[0m {self.default} \n" if self.default != None else ""
        _format = f"  {spacing}  \033[1m - format: \033[0m {self.__format} \n" if self.__format != None else ""
        doc = f"\n  {spacing}   {self.__doc}\x1B[0m \n" if self.__doc != None else ""
        children = [] if self.children == None else [v.docstring(spacing=f'{spacing}    ') for k, v in self.children.items()]
        docstring = ''.join([f"{name}{typ}{values}{default}{_format}{doc}", *children])
        return docstring
        
        
    def __getChildren(self, children):
        return {k: Field(v, k) for k, v in children.items()}
        
    def __validateStr(self, value):
        if type(value) == str and self.__values == None:
            return True
        elif type(value) == str and self.__values != None:
            if value in self.__values:
                return True
            else:
                return False
        elif type(value) != str and self.default != None:
            return self.default
        else:
            return '<PROBLEM>'
        
    def __validateInt(self, value):
        if type(value) == int and self.__values == None:
            return value
        elif type(value) == int and self.__values != None:
            if value in self.__values:
                return value
            else:
                return '<PROBLEM>'
        elif type(value) != int and self.__default != None:
            return self.__default
        else:
            return '<PROBLEM>'
        
    def __validateBool(self, value):
        if value in [True, False]:
            return value
        elif value not in [True, False] and self.__default != None:
            return self.__default
        else:
            return '<PROBLEM>'

        
    def __validateArray(self, value):
        if self.type == 'array[string]':
            v = self.__validateStr
        elif self.type == 'array[int]':
            v = self.__validateInt
        elif self.type == 'array[bool]':
            v = self.__validateBool
        elif self.type == 'array[object]':
            v = self.__validateObject
        return all([v(i) for i in value])
    
    def __validateObject(self, value):
        valid = []
        for k, v in value.items():
            valid.append(self.children[k].validate(k, v))
        return all(valid)
        
    def validate(self, key: str, value: dict):
        if self.name == key:
            if self.type == 'string':
                valid =  self.__validateStr(value)
            elif self.type == 'int':
                valid = self.__validateInt(value)
            elif self.type == 'bool':
                valid = self.__validateBool(value)
            elif self.type in ['array[string]', 'array[int]', 'array[bool]', 'array[object]']:
                valid = self.__validateArray(value)
            elif self.type == 'object':
                valid = self.__validateObject(value)
        else:
            valid = False
        return valid


        

class Endpoint(object):
    def __init__(self, endpoint: dict):
        self.__original = endpoint
        self.name = endpoint['name']
        self.method = endpoint['method']
        self.__variableEndpoint = endpoint['variableEndpoint']
        self.__baseURL = endpoint['baseURL']
        self.defaults = {}
        self.__version = endpoint['version']
        self.__endpoint = endpoint['endpoint']
        self.__description = endpoint['description']
        self.__requiredParams = endpoint['requiredParams']
        self.__requiredBody = endpoint['requiredBody']
        self.__requiredHeaders = endpoint['requiredHeaders']
        self.__requiredPath = endpoint['requiredPath']
        self.__pathFields = endpoint['pathFields']
        self.__paramFields = endpoint['paramFields']
        self.__bodyFields = endpoint['bodyFields']
        self.__headerFields = endpoint['headerFields']
        self.__initFields()
        self.__getDocstrings()
        self.defaults = self.__initDefaults()

    def __initDefaults(self):
        defaults = {}
        defaults['headers'] = self.__getDefaults(self.__headerFields)
        defaults['params'] = self.__getDefaults(self.__paramFields)
        defaults['body'] = self.__getDefaults(self.__bodyFields)
        return defaults

    def __getDefaults(self, obj:dict):
        response = {}
        for k, v in obj.items():
            if 'default' in v.keys():
                response[k] = v['default']
            elif 'children' in v.keys():
                response[k] = self.__getDefaults(v['children'])
        return response

    def __initFields(self):
        h = {k: Field(v, k) for k, v in self.__headerFields.items()}
        p = {k: Field(v, k) for k, v in self.__paramFields.items()}
        b = {k: Field(v, k) for k, v in self.__bodyFields.items()}
        u = {k: Field(v, k) for k, v in self.__pathFields.items()}
        self.fields = {
            'headers': h,
            'params': p,
            'body': b,
            'path': u
        }

    def url(self, path: dict):
        if self.__variableEndpoint:
            url = self.__getEndpoint(self.__endpoint, path)
        else:
            url = f'{self.__baseURL}{self.__endpoint}'
        return url
    
    def __getEndpoint(self, endpoint: str, path: dict):
        for k, v in path.items():
            string = '{' + k + '}'
            endpoint = endpoint.replace(string, v)
        return f'{self.__baseURL}{endpoint}'
        
    def __required(self):
        required = {
            'params': {i: self.__paramFields[i] for i in self.__requiredParams},
            'body': {i: self.__bodyFields[i] for i in self.__requiredBody},
            'headers': {i: self.__headerFields[i] for i in self.__requiredHeaders},
            'path': {i: self.__pathFields[i] for i in self.__requiredPath}
        }
        return required

    def __optional(self):
        optional = {
            'params': {i: self.__paramFields[i] for i in self.__paramFields.keys() if i not in self.__requiredParams},
            'body': {i: self.__bodyFields[i] for i in self.__bodyFields.keys() if i not in self.__requiredBody},
            'headers': {i: self.__headerFields[i] for i in self.__headerFields.keys() if i not in self.__requiredHeaders},
            'path': {i: self.__pathFields[i] for i in self.__pathFields.keys() if i not in self.__requiredPath}
        }
        return optional
        
    def __docFields(self, fields: str):
        required = self.__required()
        return len(required[fields]) > 0
        
    def __checkKeys(self, section: dict):
        if len(section.keys()) > 0:
            return True
        else:
            return False
    
    
        
    def __getRequiredInput(self):
        strings = []
        for t in ['headers', 'path', 'params', 'body']:
            if self.__docFields(t):
                strings.append(f"       > \33[1m{t.upper()} \33[0m \n")
                strings.append("    { \n")
                fields = self.fields[t]
                for k, v in fields.items():
                    if v.document == True:
                        strings.append(f"        {k}{'*' if v.required else ''}: {v.type} \n")
                strings.append("    } \n \n")
        return ''.join(strings)
            
        
    def __getDocstrings(self):
        docs = [self.__description, '\n', '\n', "\33[1m -----> Required Arguments <----- \33[0m \n \n"]
        docs.append(self.__getRequiredInput())
        specs = []
        docs.append("\33[1m -----> API Specifications <----- \33[0m \n \n")
        specs.append("\33[1m -----> API Specifications <----- \33[0m \n \n")
        docs.append(f"\033[1m URL: \033[0m \n")
        specs.append(f"\033[1m URL: \033[0m \n")
        docs.append(f"    {self.__baseURL}{self.__endpoint} \n \n")
        specs.append(f"    {self.__baseURL}{self.__endpoint} \n \n")
        # if self.__docFields('path'):
        if len(self.__pathFields) > 0:
            uDocs = [v.docstring(spacing='    ') for k, v in self.fields['path'].items()]
            uDocs = ['\033[1m Path: \033[0m \n', *uDocs]
            docs = [*docs, *uDocs]
            specs = [*specs, *uDocs]
        # if self.__docFields('headers'):
        if len(self.__headerFields) > 0:
            hDocs = [v.docstring(spacing='    ') for k, v in self.fields['headers'].items()]
            hDocs = [f"\033[1m Headers: \033[0m \n", *hDocs]
            docs = [*docs, *hDocs]
            specs = [*specs, *hDocs]
        # if self.__docFields('params'):
        if len(self.__paramFields) > 0:
            pDocs = [v.docstring(spacing='    ') for k, v in self.fields['params'].items()]
            pDocs = [f"\033[1m Params: \033[0m \n", *pDocs]
            docs = [*docs, *pDocs]
            specs = [*specs, *pDocs]
        # if self.__docFields('body'):
        if len(self.__bodyFields) > 0:
            bDocs = [v.docstring(spacing='    ') for k, v in self.fields['body'].items()]
            bDocs = [f"\033[1m Body: \033[0m", *bDocs]
            docs = [*docs, *bDocs]
            specs = [*specs, *bDocs]
        self.__docstring = ''.join(docs)
        self.__specs = ''.join(specs)
        
    def docstring(self):
        return self.__docstring
    
    def specs(self):
        return self.__specs

    def __getFields(self, groupKey: str):
        if groupKey == 'headers':
            fields = self.__headerFields
            required = self.__requiredHeaders
        elif groupKey == 'body':
            fields = self.__bodyFields
            required = self.__requiredBody
        elif groupKey == 'params':
            fields = self.__paramFields
            required = self.__requiredParams
        return fields, required
    
    def __validateGroup(self, groupKey: str, group: dict):
        valid = True
        fields, required = self.__getFields(groupKey)
        try:
            for k, v in group.items():
                if k in fields.keys():
                    if fields[k]['type'] == 'string' and type(v) == str:
                        continue
                    elif fields[k]['type'] == 'int' and type(v) == int:
                        continue
                    else:
                        valid = False
                        break
        except AttributeError:
            print('Group Key')
            print(groupKey)
            print('Group')
            print(group)
            
        for i in required:
            if i in group.keys():
                continue
            elif i not in group.keys() and 'default' in fields[i].keys():
                group[i] = fields[i]['default']
                continue
            else:
                valid = False
                break
        return valid
    
    def __stripURL(self, url):
        return url.split('?')[0].replace(self.__baseURL, '').split('/')
    
    def __validateURL(self, url):
        if self.__variableEndpoint == True and len(self.__requiredPath) > 0:
            return len(self.__stripURL(url)) == len(self.__stripURL(self.__endpoint))
        else:
            return self.__stripURL(url) == self.__endpoint
      
    def validate(self, request):
        valid = all([self.__validateURL(request.url), self.__validateGroup('body', request.json), self.__validateGroup('params', request.params), self.__validateGroup('headers', request.headers)])
        return valid

class Profile(object):
    def __init__(self, profile: dict):
        self.countryCode = profile['countryCode']
        self.profileId = str(profile['profileId'])
        self.marketplaceId = str(profile['accountInfo']['marketplaceStringId'])
        self.name = profile['accountInfo']['name']
        self.id = str(profile['accountInfo']['id'])
        
    def stamp(self, request: requests.Request):
        request.headers.update({'Amazon-Advertising-API-Scope': self.profileId})
        return request

class Tokens(object):
    def __init__(self, clientId: str, clientSecret: str, refreshToken: str):
        self.__clientId = clientId
        self.__clientSecret = clientSecret
        self.__refreshToken = refreshToken
        self.__tokenRequest()
        
    def __tokenRequest(self):
        request = requests.post(url='https://api.amazon.com/auth/o2/token', params={'grant_type': 'refresh_token', 'client_id': self.__clientId, 'refresh_token': self.__refreshToken, 'client_secret': self.__clientSecret}, headers={'Content-Type': 'application/json'})
        response = request.json()
        self.__accessToken = {'Authorization': f"Bearer {response['access_token']}", 'Amazon-Advertising-API-ClientId': self.__clientId}
        self.__expires = int(time.time() + 3600)
        
    def __checkToken(self):
        return int(time.time()) > self.__expires
        
    def stamp(self, request):
        if self.__checkToken() == True:
            request.headers.update(self.__accessToken)
        else:
            self.__tokenRequest()
            request.headers.update(self.__accessToken)
        return request
