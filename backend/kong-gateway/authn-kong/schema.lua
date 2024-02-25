return {
    name = "authn-kong",
    fields = {
        { config = {
            type = "record",
            fields = {
                -- Dummy field
                { enabled = { type = "boolean", default = true, required = false } },
            },
          },
        },
    },
}