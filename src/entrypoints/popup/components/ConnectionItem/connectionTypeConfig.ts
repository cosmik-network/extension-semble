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
 * Label, icon and copy per connection type, mirroring the web app's
 * `features/connections/const/connectionTypes.ts`.
 */
export const CONNECTION_TYPE_CONFIG: Record<
  string,
  {
    label: string;
    icon: IconType;
    description: string;
    notePlaceholder: string;
  }
> = {
  RELATED: {
    label: "Related",
    icon: BiLink,
    description: "Generally connected or associated",
    notePlaceholder: "Describe how these are related...",
  },
  SUPPORTS: {
    label: "Supports",
    icon: BiCheckCircle,
    description: "Provides evidence or reasoning in favor",
    notePlaceholder: "Explain how this supports or provides evidence...",
  },
  OPPOSES: {
    label: "Opposes",
    icon: BiXCircle,
    description: "Provides counter-evidence or reasoning against",
    notePlaceholder: "Describe the counter-argument or opposing view...",
  },
  ADDRESSES: {
    label: "Addresses",
    icon: BiMessageSquareDetail,
    description: "Responds to or answers a question or topic",
    notePlaceholder: "Explain how this responds to or answers the topic...",
  },
  HELPFUL: {
    label: "Helpful",
    icon: BiHelpCircle,
    description: "Provides useful context or background",
    notePlaceholder: "Describe what context or background this provides...",
  },
  LEADS_TO: {
    label: "Leads to",
    icon: BiRightArrowAlt,
    description: "Led me to discover this",
    notePlaceholder: "Explain how this link leads to the other",
  },
  EXPLAINER: {
    label: "Explainer",
    icon: MdOutlinePsychologyAlt,
    description: "Explains or summarizes for a broader audience",
    notePlaceholder: "Describe how this explains or clarifies...",
  },
  SUPPLEMENT: {
    label: "Supplement",
    icon: BsPaperclip,
    description:
      "Accompanying resources (e.g. data, code, other supplemental material)",
    notePlaceholder: "Explain what additional information this adds...",
  },
};
