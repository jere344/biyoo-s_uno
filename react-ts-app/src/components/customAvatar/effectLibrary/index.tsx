import React from "react";
import { FireEffect } from "./FireEffect";
import { RainbowBorderEffect } from "./RainbowBorderEffect";
import { PulseEffect } from "./PulseEffect";
import { RotateEffect } from "./RotateEffect";
import { GlowEffect } from "./GlowEffect";
import { ParticleEffect } from "./ParticleEffect";
import { ShadowEffect } from "./ShadowEffect";
import { BounceEffect } from "./BounceEffect";
import { RippleEffect } from "./RippleEffect";
import { BorderImageEffect } from "./BorderImageEffect";

// Main function to apply effects based on profile_effect value
export const applyAvatarEffect = (
    avatarElement: React.ReactNode,
    effectType?: string,
    isHovered: boolean = false,
    size: number = 40,
    effectProps?: any
) => {
    switch (effectType?.toLowerCase()) {
        case "fire":
            return <FireEffect size={size}>{avatarElement}</FireEffect>;
        case "rainbow":
            return <RainbowBorderEffect size={size}>{avatarElement}</RainbowBorderEffect>;
        case "pulse":
            return <PulseEffect>{avatarElement}</PulseEffect>;
        case "rotate":
            return <RotateEffect>{avatarElement}</RotateEffect>;
        case "glow":
            return <GlowEffect color="#00ff00">{avatarElement}</GlowEffect>;
        case "particles":
            return <ParticleEffect size={size}>{avatarElement}</ParticleEffect>;
        case "shadow":
            return <ShadowEffect>{avatarElement}</ShadowEffect>;
        case "bounce":
            return <BounceEffect>{avatarElement}</BounceEffect>;
        case "ripple":
            return <RippleEffect>{avatarElement}</RippleEffect>;
        case "belgium":
            return <BorderImageEffect 
                size={size} 
                imageUrl="https://www.worldometers.info/img/flags/be-flag.gif"
                >
                    {avatarElement}
            </BorderImageEffect>
        
        // Most populated countries
        case "china":
            return <BorderImageEffect 
                size={size} 
                imageUrl="https://www.worldometers.info/img/flags/ch-flag.gif"
                >
                    {avatarElement}
            </BorderImageEffect>
        case "india":
            return <BorderImageEffect 
                size={size} 
                imageUrl="https://www.worldometers.info/img/flags/in-flag.gif"
                >
                    {avatarElement}
            </BorderImageEffect>
        case "usa":
        case "united states":
            return <BorderImageEffect 
                size={size} 
                imageUrl="https://www.worldometers.info/img/flags/us-flag.gif"
                >
                    {avatarElement}
            </BorderImageEffect>
        case "indonesia":
            return <BorderImageEffect 
                size={size} 
                imageUrl="https://www.worldometers.info/img/flags/id-flag.gif"
                >
                    {avatarElement}
            </BorderImageEffect>
        case "pakistan":
            return <BorderImageEffect 
                size={size} 
                imageUrl="https://www.worldometers.info/img/flags/pk-flag.gif"
                >
                    {avatarElement}
            </BorderImageEffect>
        case "brazil":
            return <BorderImageEffect 
                size={size} 
                imageUrl="https://www.worldometers.info/img/flags/br-flag.gif"
                >
                    {avatarElement}
            </BorderImageEffect>
        case "nigeria":
            return <BorderImageEffect 
                size={size} 
                imageUrl="https://www.worldometers.info/img/flags/ni-flag.gif"
                >
                    {avatarElement}
            </BorderImageEffect>
        case "bangladesh":
            return <BorderImageEffect 
                size={size} 
                imageUrl="https://www.worldometers.info/img/flags/bg-flag.gif"
                >
                    {avatarElement}
            </BorderImageEffect>
        case "russia":
            return <BorderImageEffect 
                size={size} 
                imageUrl="https://www.worldometers.info/img/flags/rs-flag.gif"
                >
                    {avatarElement}
            </BorderImageEffect>
        case "japan":
            return <BorderImageEffect 
                size={size} 
                imageUrl="https://www.worldometers.info/img/flags/ja-flag.gif"
                >
                    {avatarElement}
            </BorderImageEffect>

        // LGBT Flags
        case "pride":
        case "lgbt":
            return <BorderImageEffect 
                size={size} 
                imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Gay_Pride_Flag.svg/2560px-Gay_Pride_Flag.svg.png"
                >
                    {avatarElement}
            </BorderImageEffect>
        case "transgender":
        case "trans":
            return <BorderImageEffect 
                size={size} 
                imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Transgender_Pride_flag.svg/2560px-Transgender_Pride_flag.svg.png"
                >
                    {avatarElement}
            </BorderImageEffect>
        case "bisexual":
        case "bi":
            return <BorderImageEffect 
                size={size} 
                imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Bisexual_Pride_Flag.svg/1280px-Bisexual_Pride_Flag.svg.png"
                >
                    {avatarElement}
            </BorderImageEffect>
        case "lesbian":
            return <BorderImageEffect 
                size={size} 
                imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Lesbian_Pride_Flag_2019.svg/2560px-Lesbian_Pride_Flag_2019.svg.png"
                >
                    {avatarElement}
            </BorderImageEffect>
        case "nonbinary":
            return <BorderImageEffect 
                size={size} 
                imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Nonbinary_flag.svg/1280px-Nonbinary_flag.svg.png"
                >
                    {avatarElement}
            </BorderImageEffect>
        case "pansexual":
        case "pan":
            return <BorderImageEffect 
                size={size} 
                imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Pansexuality_Pride_Flag.svg/2560px-Pansexuality_Pride_Flag.svg.png"
                >
                    {avatarElement}
            </BorderImageEffect>
        case "asexual":
        case "ace":
            return <BorderImageEffect 
                size={size} 
                imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Asexual_Pride_Flag.svg/1280px-Asexual_Pride_Flag.svg.png"
                >
                    {avatarElement}
            </BorderImageEffect>
                
        default:
            return avatarElement;
    }
};
