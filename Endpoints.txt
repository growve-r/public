// DO NOT TRY TO USE THIS FILE.
// JSON does not accept comments, but I'm commenting this to show the structure with examples.

{
  // All endpoints go in this array. This array should always be named "endpoints"
  "endpoints": [
    // Every endpoint will be a dictionary with the basic shape provided here:
    {
        // The 'name' key is what the method will be named for this endpoint. For this endpoint, you will call apiClass.trafficReport()
      "name": "trafficReport",
        // The endpoint should always start with '/' in this file.
      "endpoint": "/reporting/reports",
        // The baseURL should always include 'https://' and not include the final slash after .com/etc.
      "baseURL": "https://advertising-api.amazon.com",
        // Set this to "true" for endpoints that include a variable like /reports/{reportId}. Be sure to fill in the pathFields for this if "true"
      "variableEndpoint": false,
        // Method can be any of GET, POST, PUT, DELETE, PATCH, TRACE, HEAD, OPTIONS
      "method": "POST",
        // If the API uses 'version', enter it here, else 'None'
      "version": "3",
        // Description is the overall documentation for the endpoint. This will be filled in with the docstrings so that what this endpoint does can be easily read.
      "description": "Gross and invalid traffic report provides Sponsored Products, Sponsored Brands and Sponsored Display advertisers transparency into the nature of traffic on their campaigns. This report include all campaigns of the requested ad type and provides transparency on gross and invalid traffic metrics at campaign level for the requested days. For example, a Sponsored Products gross and invalid traffic report returns gross and invalid traffic metrics for all Sponsored Products campaigns that received impressions on the chosen dates.",
        

        // requiredParams, requiredBody, requiredPath, and requiredHeaders all accept a list of strings. If using the form, this is filled automatically, if manually entered, you MUST put any required values in these lists.
      "requiredParams": [],
      "requiredBody": [
        "endDate",
        "configuration",
        "startDate"
      ],
      "requiredPath": [],
      "requiredHeaders": [
        "Amazon-Advertising-API-ClientId",
        "Amazon-Advertising-API-Scope",
        "Content-Type"
      ],
        // pathFields, paramFields, bodyFields, and headerFields all follow the same structure:
      "pathFields": {},
      "paramFields": {},
      "bodyFields": {
          // Fields are assigned by keyname and validated/required/etc. based on the dictionary provided.
        "endDate": {
            // Required must always be included in a field dictionary, and must be in [true, false]
          "required": true,
            // Type must always be included in a field dictionary. Must be one of ['string', 'bool', 'int', 'array[string]', 'array[bool]', 'array[object]', 'array[int]', 'object']
          "type": "string",
            // Doc must always be included in the field dictionary. It must be either a documetation string for the field, or false if the field is not entered manually by the user.
            // This helps to avoid an overly long docstring for fields that are handled by the API handler class that this is provided to.
          "doc": "YYYY-MM-DD format. Maximum date range: 31 days, Data retention: 60 days",
            // Format is an optional inclusion currently used primarily for creating Docstrings.
          "format": "YYYY-MM-DD"
        },
        "configuration": {
          "required": true,
          "type": "object",
          "doc": "object (AsyncReportConfiguration)",  
            // Some fields will have a 'children' key, which houses more field dictionaries for nested dictionaries or lists.
          "children": {
            "adProduct": {
              "required": true,
              "type": "string",
                // Values is an optional key that allows the Endpoint class to validate the value against a list of permitted values.
              "values": [ "SPONSORED_PRODUCTS" ],
                // Default will set the default value if not provided by the user. This can be used in both in internally managed fields as well as fields that we want to make sure are always set.
              "default": "SPONSORED_PRODUCTS",
              "doc": "The advertising product such as SPONSORED_PRODUCTS or SPONSORED_BRANDS."
            },
            "columns": {
              "required": true,
              "type": "array[string]",
              "doc": "The list of columns to be used for report. The availability of columns depends on the selection of reportTypeId. This list cannot be null or empty.",
              "values": [
                "campaignName",
                "campaignStatus",
                "clicks",
                "endDate",
                "grossClickThroughs",
                "grossImpressions",
                "impressions",
                "invalidClickThroughRate",
                "invalidClickThroughs",
                "invalidImpressionRate",
                "invalidImpressions",
                "startDate"
              ],
              "default": [
                "campaignName",
                "campaignStatus",
                "clicks",
                "endDate",
                "grossClickThroughs",
                "grossImpressions",
                "impressions",
                "invalidClickThroughRate",
                "invalidClickThroughs",
                "invalidImpressionRate",
                "invalidImpressions",
                "startDate"
              ],
              "children": {
                "column": {
                  "type": "string",
                  "required": true,
                  "doc": "Columns for report"
                }
              }
            },
            "reportTypeId": {
              "required": true,
              "type": "string",
              "doc": false,
              "values": [ "spGrossAndInvalids" ],
              "default": "sbGrossAndInvalids"
            },
            "format": {
              "required": true,
              "type": "string",
              "values": [ "GZIP_JSON" ],
              "default": "GZIP_JSON",
              "doc": false
            },
            "groupBy": {
              "required": true,
              "type": "array[string]",
              "doc": "This field determines the aggregation level of the report data and also makes additional fields available for selection. This field cannot be null or empty.",
              "default": [ "campaign" ],
              "children": {
                "group": {
                  "type": "string",
                  "doc": "Report Aggregation Level",
                  "required": true,
                  "values": [ "campaignBudgetAmount", "campaignBudgetCurrencyCode", "campaignBudgetType", "topOfSearchImpressionShare", "campaign" ]

                }
              }
            },
            "timeUnit": {
              "required": true,
              "type": "string",
              "values": [ "SUMMARY", "DAILY" ],
              "doc": "The aggregation level of report data. If the timeUnit is set to SUMMARY, the report data is aggregated at the time period specified. The availability of time unit breakdowns depends on the selection of reportTypeId.",
              "default": "DAILY"
            }
          }
        },
        "name": {
          "required": false,
          "type": "string",
          "doc": "The name of the report."
        },
        "startDate": {
          "required": true,
          "type": "string",
          "doc": "YYYY-MM-DD format. Maximum date range: 31 days, Data retention: 60 days",
          "format": "YYYY-MM-DD"
        }
      },
      "headerFields": {
        "Amazon-Advertising-API-ClientId": {
          "required": true,
          "type": "string",
          "doc": false
        },
        "Amazon-Advertising-API-Scope": {
          "required": true,
          "type": "string",
          "doc": false
        },
        "Content-Type": {
          "required": true,
          "type": "string",
          "doc": false,
          "default": "application/vnd.createasyncreportrequest.v3+json"
        }
      }
    }
  ]
}

// A half-assed schema:
{
  "endpoints": [
    "name": str,
    "endpoint": str,
    "baseURL": str,
    "variableEndpoint": bool,
    "method": str: [GET, POST, PUT, DELETE, PATCH, TRACE, HEAD, OPTIONS],
    "version": str,
    "description": str,
    "requiredParams": list,
    "requriedBody": list,
    "requirePath": list,
    "requiredHeaders": list,
    "paramFields": dict: {
        "required": bool,
        "type": str,
        "default": any ? optional,
        "values": list[any] ? optional,
        "format": str ? optional,
        "doc": str|false,
        },
    "bodyFields": dict: {
        "required": bool,
        "type": str,
        "default": any ? optional,
        "values": list[any] ? optional,
        "format": str ? optional,
        "doc": str|false,
        },
    "pathFields": dict: {
        "required": bool,
        "type": str,
        "default": any ? optional,
        "values": list[any] ? optional,
        "format": str ? optional,
        "doc": str|false,
        },
    "headerFields": dict: {
        "required": bool,
        "type": str,
        "default": any ? optional,
        "values": list[any] ? optional,
        "format": str ? optional,
        "doc": str|false,
        }     
  ]
}
