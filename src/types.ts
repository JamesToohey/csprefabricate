enum Directive {
    DEFAULT_SRC = "default-src",
    SCRIPT_SRC = "script-src",
    STYLE_SRC = "style-src",
    IMG_SRC = "img-src",
    CONNECT_SRC = "connect-src",
    FONT_SRC = "font-src",
    OBJECT_SRC = "object-src",
    MEDIA_SRC = "media-src",
    FRAME_SRC = "frame-src",
    SANDBOX = "sandbox",
    REPORT_URI = "report-uri",
    CHILD_SRC = "child-src",
    FORM_ACTION = "form-action",
    FRAME_ANCESTORS = "frame-ancestors",
    PLUGIN_TYPES = "plugin-types",
    BASE_URI = "base-uri",
    REPORT_TO = "report-to",
    WORKER_SRC = "worker-src",
    MANIFEST_SRC = "manifest-src",
    PREFETCH_SRC = "prefetch-src",
    NAVIGATE_TO = "navigate-to",
    REQUIRE_TRUSTED_TYPES_FOR = "require-trusted-types-for",
    TRUSTED_TYPES = "trusted-types",
    UPGRADE_INSECURE_REQUESTS = "upgrade-insecure-requests",
    BLOCK_ALL_MIXED_CONTENT = "block-all-mixed-content",
    SCRIPT_SRC_ELEM = "script-src-elem",
    SCRIPT_SRC_ATTR = "script-src-attr",
    STYLE_SRC_ELEM = "style-src-elem",
    STYLE_SRC_ATTR = "style-src-attr",
    WEBRTC = "webrtc",
}

type BasicDirectiveRule = Array<string | Record<string, Array<string>>>;
type BlankDirectiveRule = null;
type Rules = BasicDirectiveRule | BlankDirectiveRule;
interface ContentSecurityPolicy {
    [Directive.DEFAULT_SRC]?: BasicDirectiveRule;
    [Directive.SCRIPT_SRC]?: BasicDirectiveRule;
    [Directive.STYLE_SRC]?: BasicDirectiveRule;
    [Directive.IMG_SRC]?: BasicDirectiveRule;
    [Directive.CONNECT_SRC]?: BasicDirectiveRule;
    [Directive.FONT_SRC]?: BasicDirectiveRule;
    [Directive.OBJECT_SRC]?: BasicDirectiveRule;
    [Directive.MEDIA_SRC]?: BasicDirectiveRule;
    [Directive.FRAME_SRC]?: BasicDirectiveRule;
    [Directive.SANDBOX]?: BasicDirectiveRule;
    [Directive.REPORT_URI]?: BasicDirectiveRule;
    [Directive.CHILD_SRC]?: BasicDirectiveRule;
    [Directive.FORM_ACTION]?: BasicDirectiveRule;
    [Directive.FRAME_ANCESTORS]?: BasicDirectiveRule;
    [Directive.PLUGIN_TYPES]?: BasicDirectiveRule;
    [Directive.BASE_URI]?: BasicDirectiveRule;
    [Directive.REPORT_TO]?: BasicDirectiveRule;
    [Directive.WORKER_SRC]?: BasicDirectiveRule;
    [Directive.MANIFEST_SRC]?: BasicDirectiveRule;
    [Directive.PREFETCH_SRC]?: BasicDirectiveRule;
    [Directive.NAVIGATE_TO]?: BasicDirectiveRule;
    [Directive.REQUIRE_TRUSTED_TYPES_FOR]?: BasicDirectiveRule;
    [Directive.TRUSTED_TYPES]?: BasicDirectiveRule;
    [Directive.UPGRADE_INSECURE_REQUESTS]?: BlankDirectiveRule;
    [Directive.BLOCK_ALL_MIXED_CONTENT]?: BlankDirectiveRule;
    [Directive.SCRIPT_SRC_ELEM]?: BasicDirectiveRule;
    [Directive.SCRIPT_SRC_ATTR]?: BasicDirectiveRule;
    [Directive.STYLE_SRC_ELEM]?: BasicDirectiveRule;
    [Directive.STYLE_SRC_ATTR]?: BasicDirectiveRule;
    [Directive.WEBRTC]?: BasicDirectiveRule;
}

export {ContentSecurityPolicy, Rules, Directive, BasicDirectiveRule};
