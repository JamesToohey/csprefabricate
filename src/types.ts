export enum Directive {
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
}

type BasicDirective = Array<string | Record<string, Array<string>>>;
interface ContentSecurityPolicy {
    [Directive.DEFAULT_SRC]?: BasicDirective;
    [Directive.SCRIPT_SRC]?: BasicDirective;
    [Directive.STYLE_SRC]?: BasicDirective;
    [Directive.IMG_SRC]?: BasicDirective;
    [Directive.CONNECT_SRC]?: BasicDirective;
    [Directive.FONT_SRC]?: BasicDirective;
    [Directive.OBJECT_SRC]?: BasicDirective;
    [Directive.MEDIA_SRC]?: BasicDirective;
    [Directive.FRAME_SRC]?: BasicDirective;
    [Directive.SANDBOX]?: BasicDirective;
    [Directive.REPORT_URI]?: BasicDirective;
    [Directive.CHILD_SRC]?: BasicDirective;
    [Directive.FORM_ACTION]?: BasicDirective;
    [Directive.FRAME_ANCESTORS]?: BasicDirective;
    [Directive.PLUGIN_TYPES]?: BasicDirective;
    [Directive.BASE_URI]?: BasicDirective;
    [Directive.REPORT_TO]?: BasicDirective;
    [Directive.WORKER_SRC]?: BasicDirective;
    [Directive.MANIFEST_SRC]?: BasicDirective;
    [Directive.PREFETCH_SRC]?: BasicDirective;
    [Directive.NAVIGATE_TO]?: BasicDirective;
    [Directive.REQUIRE_TRUSTED_TYPES_FOR]?: BasicDirective;
    [Directive.TRUSTED_TYPES]?: BasicDirective;
    [Directive.UPGRADE_INSECURE_REQUESTS]?: BasicDirective;
    [Directive.BLOCK_ALL_MIXED_CONTENT]?: BasicDirective;
}

export {ContentSecurityPolicy};
