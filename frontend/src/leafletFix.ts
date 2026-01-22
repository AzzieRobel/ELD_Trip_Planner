import leaflet from "leaflet";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

delete (leaflet.Icon.Default.prototype as any)._getIconUrl;

leaflet.Icon.Default.mergeOptions({
    iconUrl: icon,
    shadowUrl: iconShadow
});
