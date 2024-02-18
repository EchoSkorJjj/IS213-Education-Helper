return {
    name = "authn-kong",
    fields = {
        { config = {
            type = "record",
            fields = {
                {
                    public_paths = {
                      type = "array",
                      default = {},
                      required = false,
                      elements = { type = "string" },
                    }
                },
            },
          },
        },
    },
}