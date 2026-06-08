import type { IconType } from "react-icons";
import {
  BiCheckCircle,
  BiHelpCircle,
  BiLink,
  BiMessageSquareDetail,
  BiRightArrowAlt,
  BiXCircle,
} from "react-icons/bi";
import { BsPaperclip } from "react-icons/bs";
import { MdOutlinePsychologyAlt } from "react-icons/md";

/**
 * Label + icon per connection type, mirroring the web app's
 * `features/connections/const/connectionTypes.ts`.
 */
export const CONNECTION_TYPE_CONFIG: Record<
  string,
  { label: string; icon: IconType }
> = {
  RELATED: { label: "Related", icon: BiLink },
  SUPPORTS: { label: "Supports", icon: BiCheckCircle },
  OPPOSES: { label: "Opposes", icon: BiXCircle },
  ADDRESSES: { label: "Addresses", icon: BiMessageSquareDetail },
  HELPFUL: { label: "Helpful", icon: BiHelpCircle },
  LEADS_TO: { label: "Leads to", icon: BiRightArrowAlt },
  EXPLAINER: { label: "Explainer", icon: MdOutlinePsychologyAlt },
  SUPPLEMENT: { label: "Supplement", icon: BsPaperclip },
};
