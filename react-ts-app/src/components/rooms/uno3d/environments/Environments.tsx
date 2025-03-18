import React from "react";
import GrassEnvironment from "./GrassEnvironment";
import AutumnGrassEnvironment from "./AutumnGrassEnvironment";
import Void from "./Void";
import City from "./city";
import Hut from "./Hut";

interface EnvironmentsProps {
    environment: "default" | "grass" | "void" | "clouds" | "city" | string;
}

const Environments: React.FC<EnvironmentsProps> = ({ environment }) => {
    switch (environment.toLowerCase()) {
        case "default":
            return <GrassEnvironment />
        case "grass":
            return <GrassEnvironment />
        case "autumn":
            return <AutumnGrassEnvironment />
        case "void":
            return <Void />
        case "city":
            return <City/>
        case "hut":
            return <Hut />
        default:
            return <Void />
    }
}


export default Environments;
