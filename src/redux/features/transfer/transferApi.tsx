import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import config from "../../../config"
import { RootState } from "../../store"

export const transferApi = createApi({
    reducePath: "transfer",
    baseQuery: fetchBaseQuery({
        baseUrl: `${config.BACKEND_URL}/v1/transfer`,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token;
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        },
        credentials: "include"
    }),
    endpoints: (builder) => ({
        transfer: builder.mutation({
            query: (data) => ({
                url: "",
                method: "POST",
                body: data
            })
        })
    })
})

export const { useTransferMutation } = transferApi;
