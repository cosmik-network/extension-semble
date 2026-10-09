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
import { LuArrowLeftRight } from "react-icons/lu";
import { MdOutlinePsychologyAlt } from "react-icons/md";
import { TbBlockquote } from "react-icons/tb";

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
  SAME_AS: {
    label: "Same as",
    icon: LuArrowLeftRight,
    description: "The same thing in a different place (mirror, reupload, DOI)",
    notePlaceholder: "Note where this version differs, if at all...",
  },
  REFERENCES: {
    label: "References",
    icon: TbBlockquote,
    description: "Cites or points to the other",
    notePlaceholder: "Describe what is referenced or cited...",
  },
};
