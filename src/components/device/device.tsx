import { component$, useClientEffect$ } from "@builder.io/qwik";

export default component$((props:{messages:any[]}) => {


    useClientEffect$(() => {




    })

    return(
        <div>
            <h1>DEVICE</h1>
            <ul>
                {props.messages.map((m:any) => <li>{JSON.stringify(m)}</li>)}
            </ul>
        </div>
    )

})