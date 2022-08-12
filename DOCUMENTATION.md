# How to add a file / files

Add your json file to the `genders` directory, or, for systems, add a subdirectory of `genders` with an accompying json in the `genders` folder.

# File structure:
(In typescript for simplicity)
```typescript
interface Gender {
    // A list of your preferred names
    "names": string[],
    // The name of your gender, null if there's no name attached to it
    "type": string|null,
    "presentation": {
        // All of these values must add up to 10.0
        "masc": number,
        "fem": number,
        "andro": number,
        "none": number,
        // An object containing any custom presentation types
        "custom"?: {
            /* A key of the presentation id with a value of an object
               Ex: 
                {
                    "foxxo": {
                        "title": "Foxxo",
                        "value": 10.0
                    }
                }
            */
            [presentation_id: string]: {
                "title": string,
                "value": number
            }
        }
    },
    // A list of your preferred pronouns
    "pronouns": string[]
    // An object containing any extra metadata
    "custom"?: {
        [custom_id: string]: {
            "title": string,
            "value": any
        }
    }
}
```