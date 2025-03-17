import React from "react";
import GrassEnvironment from "./GrassEnvironment";
import Void from "./Void";
import City from "./city";


interface EnvironmentsProps {
    environment: "default" | "grass" | "void" | "clouds" | "city"
}

const Environments: React.FC<EnvironmentsProps> = ({ environment }) => {
    switch (environment) {
        case "default":
            return <GrassEnvironment />
        case "grass":
            return <GrassEnvironment />
        case "void":
            return <Void />
        case "city":
            return <City/>
        default:
            return <Void />
    }
}


export default Environments;
