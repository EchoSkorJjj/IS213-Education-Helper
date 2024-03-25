return {
    name = "authn-kong",
    fields = {{
        config = {
            type = "record",
            fields = {{
                jwt_secret = {
                    type = "string",
                    required = true
                }
            }, {

                public_paths = {
                    type = "array",
                    default = {},
                    required = false,
                    elements = {
                        type = "string"
                    }
                }
            }}
        }
    }}
}
