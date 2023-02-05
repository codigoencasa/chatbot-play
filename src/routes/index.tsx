import { component$, useClientEffect$ } from "@builder.io/qwik";
import { useLocation, useNavigate } from "@builder.io/qwik-city";
import { UUIDGeneratorBrowser } from "~/utils/uuid-browser";

export default component$(() => {

    const location = useLocation()
    const navigate = useNavigate()

    useClientEffect$(() => {
        const slug = UUIDGeneratorBrowser()
        if(!location.params?.slug) navigate.path = `/${slug}`
        return () => null
    })

    return(<>Redirect...</>)
  
})