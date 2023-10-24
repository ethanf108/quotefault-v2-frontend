import { OidcUserInfo } from "@axa-fr/react-oidc";

export const isEboardOrRTP = (user: OidcUserInfo) => ["eboard", "rtp"].filter(t => (user?.groups ?? []).includes(t)).length > 0;
