import {
    BasicDirectiveRule,
    BlankDirectiveRule,
    AllowBlockRule,
    RequireTrustedTypesForRule,
    CSP,
    CSPDirective,
    ContentSecurityPolicy,
    Directive,
    Rules,
    WarningOptions,
} from "../index";

const rules: Rules = ["self", "example.com"];
const basicRule: BasicDirectiveRule = ["self", "example.com"];
const blankRule: BlankDirectiveRule = null;
const allowBlockRule: AllowBlockRule = ["allow"];
const requireTrustedTypesForRule: RequireTrustedTypesForRule = ["script"];
const directive: CSPDirective = Directive.DEFAULT_SRC;
const csp: CSP = {[directive]: rules};
const cspByName: ContentSecurityPolicy = {[Directive.SCRIPT_SRC]: basicRule};
const options: WarningOptions = {overlyPermissive: false};

void rules;
void basicRule;
void blankRule;
void allowBlockRule;
void requireTrustedTypesForRule;
void directive;
void csp;
void cspByName;
void options;
