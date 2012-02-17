/**
 * GLIntelliJBandaid is a project I created so I could have some
 * kind of at least (ghetto) autocomplete from Intellij IDEA
 *
 * I made it because I'm a n00b and I need autocomplete
 *
 * Mario Gonzalez
 * http://onedayitwillmake.com
 */

var GL = GL || {};

    /* ClearBufferMask */
    GL.DEPTH_BUFFER_BIT               = 0x00000100;
    GL.STENCIL_BUFFER_BIT             = 0x00000400;
    GL.COLOR_BUFFER_BIT               = 0x00004000;

    /* BeginMode */
    GL.POINTS                         = 0x0000;
    GL.LINES                          = 0x0001;
    GL.LINE_LOOP                      = 0x0002;
    GL.LINE_STRIP                     = 0x0003;
    GL.TRIANGLES                      = 0x0004;
    GL.TRIANGLE_STRIP                 = 0x0005;
    GL.TRIANGLE_FAN                   = 0x0006;

    /* AlphaFunction (not supported in ES20) */
    /*      NEVER */
    /*      LESS */
    /*      EQUAL */
    /*      LEQUAL */
    /*      GREATER */
    /*      NOTEQUAL */
    /*      GEQUAL */
    /*      ALWAYS */

    /* BlendingFactorDest */
    GL.ZERO                           = 0;
    GL.ONE                            = 1;
    GL.SRC_COLOR                      = 0x0300;
    GL.ONE_MINUS_SRC_COLOR            = 0x0301;
    GL.SRC_ALPHA                      = 0x0302;
    GL.ONE_MINUS_SRC_ALPHA            = 0x0303;
    GL.DST_ALPHA                      = 0x0304;
    GL.ONE_MINUS_DST_ALPHA            = 0x0305;

    /* BlendingFactorSrc */
    /*      ZERO */
    /*      ONE */
    GL.DST_COLOR                      = 0x0306;
    GL.ONE_MINUS_DST_COLOR            = 0x0307;
    GL.SRC_ALPHA_SATURATE             = 0x0308;
    /*      SRC_ALPHA */
    /*      ONE_MINUS_SRC_ALPHA */
    /*      DST_ALPHA */
    /*      ONE_MINUS_DST_ALPHA */

    /* BlendEquationSeparate */
    GL.FUNC_ADD                       = 0x8006;
    GL.BLEND_EQUATION                 = 0x8009;
    GL.BLEND_EQUATION_RGB             = 0x8009;   /* same as BLEND_EQUATION */
    GL.BLEND_EQUATION_ALPHA           = 0x883D;

    /* BlendSubtract */
    GL.FUNC_SUBTRACT                  = 0x800A;
    GL.FUNC_REVERSE_SUBTRACT          = 0x800B;

    /* Separate Blend Functions */
    GL.BLEND_DST_RGB                  = 0x80C8;
    GL.BLEND_SRC_RGB                  = 0x80C9;
    GL.BLEND_DST_ALPHA                = 0x80CA;
    GL.BLEND_SRC_ALPHA                = 0x80CB;
    GL.CONSTANT_COLOR                 = 0x8001;
    GL.ONE_MINUS_CONSTANT_COLOR       = 0x8002;
    GL.CONSTANT_ALPHA                 = 0x8003;
    GL.ONE_MINUS_CONSTANT_ALPHA       = 0x8004;
    GL.BLEND_COLOR                    = 0x8005;

    /* Buffer Objects */
    GL.ARRAY_BUFFER                   = 0x8892;
    GL.ELEMENT_ARRAY_BUFFER           = 0x8893;
    GL.ARRAY_BUFFER_BINDING           = 0x8894;
    GL.ELEMENT_ARRAY_BUFFER_BINDING   = 0x8895;

    GL.STREAM_DRAW                    = 0x88E0;
    GL.STATIC_DRAW                    = 0x88E4;
    GL.DYNAMIC_DRAW                   = 0x88E8;

    GL.BUFFER_SIZE                    = 0x8764;
    GL.BUFFER_USAGE                   = 0x8765;

    GL.CURRENT_VERTEX_ATTRIB          = 0x8626;

    /* CullFaceMode */
    GL.FRONT                          = 0x0404;
    GL.BACK                           = 0x0405;
    GL.FRONT_AND_BACK                 = 0x0408;

    /* DepthFunction */
    /*      NEVER */
    /*      LESS */
    /*      EQUAL */
    /*      LEQUAL */
    /*      GREATER */
    /*      NOTEQUAL */
    /*      GEQUAL */
    /*      ALWAYS */

    /* EnableCap */
    /* TEXTURE_2D */
    GL.CULL_FACE                      = 0x0B44;
    GL.BLEND                          = 0x0BE2;
    GL.DITHER                         = 0x0BD0;
    GL.STENCIL_TEST                   = 0x0B90;
    GL.DEPTH_TEST                     = 0x0B71;
    GL.SCISSOR_TEST                   = 0x0C11;
    GL.POLYGON_OFFSET_FILL            = 0x8037;
    GL.SAMPLE_ALPHA_TO_COVERAGE       = 0x809E;
    GL.SAMPLE_COVERAGE                = 0x80A0;

    /* ErrorCode */
    GL.NO_ERROR                       = 0;
    GL.INVALID_ENUM                   = 0x0500;
    GL.INVALID_VALUE                  = 0x0501;
    GL.INVALID_OPERATION              = 0x0502;
    GL.OUT_OF_MEMORY                  = 0x0505;

    /* FrontFaceDirection */
    GL.CW                             = 0x0900;
    GL.CCW                            = 0x0901;

    /* GetPName */
    GL.LINE_WIDTH                     = 0x0B21;
    GL.ALIASED_POINT_SIZE_RANGE       = 0x846D;
    GL.ALIASED_LINE_WIDTH_RANGE       = 0x846E;
    GL.CULL_FACE_MODE                 = 0x0B45;
    GL.FRONT_FACE                     = 0x0B46;
    GL.DEPTH_RANGE                    = 0x0B70;
    GL.DEPTH_WRITEMASK                = 0x0B72;
    GL.DEPTH_CLEAR_VALUE              = 0x0B73;
    GL.DEPTH_FUNC                     = 0x0B74;
    GL.STENCIL_CLEAR_VALUE            = 0x0B91;
    GL.STENCIL_FUNC                   = 0x0B92;
    GL.STENCIL_FAIL                   = 0x0B94;
    GL.STENCIL_PASS_DEPTH_FAIL        = 0x0B95;
    GL.STENCIL_PASS_DEPTH_PASS        = 0x0B96;
    GL.STENCIL_REF                    = 0x0B97;
    GL.STENCIL_VALUE_MASK             = 0x0B93;
    GL.STENCIL_WRITEMASK              = 0x0B98;
    GL.STENCIL_BACK_FUNC              = 0x8800;
    GL.STENCIL_BACK_FAIL              = 0x8801;
    GL.STENCIL_BACK_PASS_DEPTH_FAIL   = 0x8802;
    GL.STENCIL_BACK_PASS_DEPTH_PASS   = 0x8803;
    GL.STENCIL_BACK_REF               = 0x8CA3;
    GL.STENCIL_BACK_VALUE_MASK        = 0x8CA4;
    GL.STENCIL_BACK_WRITEMASK         = 0x8CA5;
    GL.VIEWPORT                       = 0x0BA2;
    GL.SCISSOR_BOX                    = 0x0C10;
    /*      SCISSOR_TEST */
    GL.COLOR_CLEAR_VALUE              = 0x0C22;
    GL.COLOR_WRITEMASK                = 0x0C23;
    GL.UNPACK_ALIGNMENT               = 0x0CF5;
    GL.PACK_ALIGNMENT                 = 0x0D05;
    GL.MAX_TEXTURE_SIZE               = 0x0D33;
    GL.MAX_VIEWPORT_DIMS              = 0x0D3A;
    GL.SUBPIXEL_BITS                  = 0x0D50;
    GL.RED_BITS                       = 0x0D52;
    GL.GREEN_BITS                     = 0x0D53;
    GL.BLUE_BITS                      = 0x0D54;
    GL.ALPHA_BITS                     = 0x0D55;
    GL.DEPTH_BITS                     = 0x0D56;
    GL.STENCIL_BITS                   = 0x0D57;
    GL.POLYGON_OFFSET_UNITS           = 0x2A00;
    /*      POLYGON_OFFSET_FILL */
    GL.POLYGON_OFFSET_FACTOR          = 0x8038;
    GL.TEXTURE_BINDING_2D             = 0x8069;
    GL.SAMPLE_BUFFERS                 = 0x80A8;
    GL.SAMPLES                        = 0x80A9;
    GL.SAMPLE_COVERAGE_VALUE          = 0x80AA;
    GL.SAMPLE_COVERAGE_INVERT         = 0x80AB;

    /* GetTextureParameter */
    /*      TEXTURE_MAG_FILTER */
    /*      TEXTURE_MIN_FILTER */
    /*      TEXTURE_WRAP_S */
    /*      TEXTURE_WRAP_T */

    GL.NUM_COMPRESSED_TEXTURE_FORMATS = 0x86A2;
    GL.COMPRESSED_TEXTURE_FORMATS     = 0x86A3;

    /* HintMode */
    GL.DONT_CARE                      = 0x1100;
    GL.FASTEST                        = 0x1101;
    GL.NICEST                         = 0x1102;

    /* HintTarget */
    GL.GENERATE_MIPMAP_HINT            = 0x8192;

    /* DataType */
    GL.BYTE                           = 0x1400;
    GL.UNSIGNED_BYTE                  = 0x1401;
    GL.SHORT                          = 0x1402;
    GL.UNSIGNED_SHORT                 = 0x1403;
    GL.INT                            = 0x1404;
    GL.UNSIGNED_INT                   = 0x1405;
    GL.FLOAT                          = 0x1406;

    /* PixelFormat */
    GL.DEPTH_COMPONENT                = 0x1902;
    GL.ALPHA                          = 0x1906;
    GL.RGB                            = 0x1907;
    GL.RGBA                           = 0x1908;
    GL.LUMINANCE                      = 0x1909;
    GL.LUMINANCE_ALPHA                = 0x190A;

    /* PixelType */
    /*      UNSIGNED_BYTE */
    GL.UNSIGNED_SHORT_4_4_4_4         = 0x8033;
    GL.UNSIGNED_SHORT_5_5_5_1         = 0x8034;
    GL.UNSIGNED_SHORT_5_6_5           = 0x8363;

    /* Shaders */
    GL.FRAGMENT_SHADER                  = 0x8B30;
    GL.VERTEX_SHADER                    = 0x8B31;
    GL.MAX_VERTEX_ATTRIBS               = 0x8869;
    GL.MAX_VERTEX_UNIFORM_VECTORS       = 0x8DFB;
    GL.MAX_VARYING_VECTORS              = 0x8DFC;
    GL.MAX_COMBINED_TEXTURE_IMAGE_UNITS = 0x8B4D;
    GL.MAX_VERTEX_TEXTURE_IMAGE_UNITS   = 0x8B4C;
    GL.MAX_TEXTURE_IMAGE_UNITS          = 0x8872;
    GL.MAX_FRAGMENT_UNIFORM_VECTORS     = 0x8DFD;
    GL.SHADER_TYPE                      = 0x8B4F;
    GL.DELETE_STATUS                    = 0x8B80;
    GL.LINK_STATUS                      = 0x8B82;
    GL.VALIDATE_STATUS                  = 0x8B83;
    GL.ATTACHED_SHADERS                 = 0x8B85;
    GL.ACTIVE_UNIFORMS                  = 0x8B86;
    GL.ACTIVE_ATTRIBUTES                = 0x8B89;
    GL.SHADING_LANGUAGE_VERSION         = 0x8B8C;
    GL.CURRENT_PROGRAM                  = 0x8B8D;

    /* StencilFunction */
    GL.NEVER                          = 0x0200;
    GL.LESS                           = 0x0201;
    GL.EQUAL                          = 0x0202;
    GL.LEQUAL                         = 0x0203;
    GL.GREATER                        = 0x0204;
    GL.NOTEQUAL                       = 0x0205;
    GL.GEQUAL                         = 0x0206;
    GL.ALWAYS                         = 0x0207;

    /* StencilOp */
    /*      ZERO */
    GL.KEEP                           = 0x1E00;
    GL.REPLACE                        = 0x1E01;
    GL.INCR                           = 0x1E02;
    GL.DECR                           = 0x1E03;
    GL.INVERT                         = 0x150A;
    GL.INCR_WRAP                      = 0x8507;
    GL.DECR_WRAP                      = 0x8508;

    /* StringName */
    GL.VENDOR                         = 0x1F00;
    GL.RENDERER                       = 0x1F01;
    GL.VERSION                        = 0x1F02;

    /* TextureMagFilter */
    GL.NEAREST                        = 0x2600;
    GL.LINEAR                         = 0x2601;

    /* TextureMinFilter */
    /*      NEAREST */
    /*      LINEAR */
    GL.NEAREST_MIPMAP_NEAREST         = 0x2700;
    GL.LINEAR_MIPMAP_NEAREST          = 0x2701;
    GL.NEAREST_MIPMAP_LINEAR          = 0x2702;
    GL.LINEAR_MIPMAP_LINEAR           = 0x2703;

    /* TextureParameterName */
    GL.TEXTURE_MAG_FILTER             = 0x2800;
    GL.TEXTURE_MIN_FILTER             = 0x2801;
    GL.TEXTURE_WRAP_S                 = 0x2802;
    GL.TEXTURE_WRAP_T                 = 0x2803;

    /* TextureTarget */
    GL.TEXTURE_2D                     = 0x0DE1;
    GL.TEXTURE                        = 0x1702;

    GL.TEXTURE_CUBE_MAP               = 0x8513;
    GL.TEXTURE_BINDING_CUBE_MAP       = 0x8514;
    GL.TEXTURE_CUBE_MAP_POSITIVE_X    = 0x8515;
    GL.TEXTURE_CUBE_MAP_NEGATIVE_X    = 0x8516;
    GL.TEXTURE_CUBE_MAP_POSITIVE_Y    = 0x8517;
    GL.TEXTURE_CUBE_MAP_NEGATIVE_Y    = 0x8518;
    GL.TEXTURE_CUBE_MAP_POSITIVE_Z    = 0x8519;
    GL.TEXTURE_CUBE_MAP_NEGATIVE_Z    = 0x851A;
    GL.MAX_CUBE_MAP_TEXTURE_SIZE      = 0x851C;

    /* TextureUnit */
    GL.TEXTURE0                       = 0x84C0;
    GL.TEXTURE1                       = 0x84C1;
    GL.TEXTURE2                       = 0x84C2;
    GL.TEXTURE3                       = 0x84C3;
    GL.TEXTURE4                       = 0x84C4;
    GL.TEXTURE5                       = 0x84C5;
    GL.TEXTURE6                       = 0x84C6;
    GL.TEXTURE7                       = 0x84C7;
    GL.TEXTURE8                       = 0x84C8;
    GL.TEXTURE9                       = 0x84C9;
    GL.TEXTURE10                      = 0x84CA;
    GL.TEXTURE11                      = 0x84CB;
    GL.TEXTURE12                      = 0x84CC;
    GL.TEXTURE13                      = 0x84CD;
    GL.TEXTURE14                      = 0x84CE;
    GL.TEXTURE15                      = 0x84CF;
    GL.TEXTURE16                      = 0x84D0;
    GL.TEXTURE17                      = 0x84D1;
    GL.TEXTURE18                      = 0x84D2;
    GL.TEXTURE19                      = 0x84D3;
    GL.TEXTURE20                      = 0x84D4;
    GL.TEXTURE21                      = 0x84D5;
    GL.TEXTURE22                      = 0x84D6;
    GL.TEXTURE23                      = 0x84D7;
    GL.TEXTURE24                      = 0x84D8;
    GL.TEXTURE25                      = 0x84D9;
    GL.TEXTURE26                      = 0x84DA;
    GL.TEXTURE27                      = 0x84DB;
    GL.TEXTURE28                      = 0x84DC;
    GL.TEXTURE29                      = 0x84DD;
    GL.TEXTURE30                      = 0x84DE;
    GL.TEXTURE31                      = 0x84DF;
    GL.ACTIVE_TEXTURE                 = 0x84E0;

    /* TextureWrapMode */
    GL.REPEAT                         = 0x2901;
    GL.CLAMP_TO_EDGE                  = 0x812F;
    GL.MIRRORED_REPEAT                = 0x8370;

    /* Uniform Types */
    GL.FLOAT_VEC2                     = 0x8B50;
    GL.FLOAT_VEC3                     = 0x8B51;
    GL.FLOAT_VEC4                     = 0x8B52;
    GL.INT_VEC2                       = 0x8B53;
    GL.INT_VEC3                       = 0x8B54;
    GL.INT_VEC4                       = 0x8B55;
    GL.BOOL                           = 0x8B56;
    GL.BOOL_VEC2                      = 0x8B57;
    GL.BOOL_VEC3                      = 0x8B58;
    GL.BOOL_VEC4                      = 0x8B59;
    GL.FLOAT_MAT2                     = 0x8B5A;
    GL.FLOAT_MAT3                     = 0x8B5B;
    GL.FLOAT_MAT4                     = 0x8B5C;
    GL.SAMPLER_2D                     = 0x8B5E;
    GL.SAMPLER_CUBE                   = 0x8B60;

    /* Vertex Arrays */
    GL.VERTEX_ATTRIB_ARRAY_ENABLED        = 0x8622;
    GL.VERTEX_ATTRIB_ARRAY_SIZE           = 0x8623;
    GL.VERTEX_ATTRIB_ARRAY_STRIDE         = 0x8624;
    GL.VERTEX_ATTRIB_ARRAY_TYPE           = 0x8625;
    GL.VERTEX_ATTRIB_ARRAY_NORMALIZED     = 0x886A;
    GL.VERTEX_ATTRIB_ARRAY_POINTER        = 0x8645;
    GL.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING = 0x889F;

    /* Shader Source */
    GL.COMPILE_STATUS                 = 0x8B81;

    /* Shader Precision-Specified Types */
    GL.LOW_FLOAT                      = 0x8DF0;
    GL.MEDIUM_FLOAT                   = 0x8DF1;
    GL.HIGH_FLOAT                     = 0x8DF2;
    GL.LOW_INT                        = 0x8DF3;
    GL.MEDIUM_INT                     = 0x8DF4;
    GL.HIGH_INT                       = 0x8DF5;

    /* Framebuffer Object. */
    GL.FRAMEBUFFER                    = 0x8D40;
    GL.RENDERBUFFER                   = 0x8D41;

    GL.RGBA4                          = 0x8056;
    GL.RGB5_A1                        = 0x8057;
    GL.RGB565                         = 0x8D62;
    GL.DEPTH_COMPONENT16              = 0x81A5;
    GL.STENCIL_INDEX                  = 0x1901;
    GL.STENCIL_INDEX8                 = 0x8D48;
    GL.DEPTH_STENCIL                  = 0x84F9;

    GL.RENDERBUFFER_WIDTH             = 0x8D42;
    GL.RENDERBUFFER_HEIGHT            = 0x8D43;
    GL.RENDERBUFFER_INTERNAL_FORMAT   = 0x8D44;
    GL.RENDERBUFFER_RED_SIZE          = 0x8D50;
    GL.RENDERBUFFER_GREEN_SIZE        = 0x8D51;
    GL.RENDERBUFFER_BLUE_SIZE         = 0x8D52;
    GL.RENDERBUFFER_ALPHA_SIZE        = 0x8D53;
    GL.RENDERBUFFER_DEPTH_SIZE        = 0x8D54;
    GL.RENDERBUFFER_STENCIL_SIZE      = 0x8D55;

    GL.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE           = 0x8CD0;
    GL.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME           = 0x8CD1;
    GL.FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL         = 0x8CD2;
    GL.FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE = 0x8CD3;

    GL.COLOR_ATTACHMENT0              = 0x8CE0;
    GL.DEPTH_ATTACHMENT               = 0x8D00;
    GL.STENCIL_ATTACHMENT             = 0x8D20;
    GL.DEPTH_STENCIL_ATTACHMENT       = 0x821A;

    GL.NONE                           = 0;

    GL.FRAMEBUFFER_COMPLETE                      = 0x8CD5;
    GL.FRAMEBUFFER_INCOMPLETE_ATTACHMENT         = 0x8CD6;
    GL.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT = 0x8CD7;
    GL.FRAMEBUFFER_INCOMPLETE_DIMENSIONS         = 0x8CD9;
    GL.FRAMEBUFFER_UNSUPPORTED                   = 0x8CDD;

    GL.FRAMEBUFFER_BINDING            = 0x8CA6;
    GL.RENDERBUFFER_BINDING           = 0x8CA7;
    GL.MAX_RENDERBUFFER_SIZE          = 0x84E8;

    GL.INVALID_FRAMEBUFFER_OPERATION  = 0x0506;

    /* WebGL-specific enums */
    GL.UNPACK_FLIP_Y_WEBGL            = 0x9240;
    GL.UNPACK_PREMULTIPLY_ALPHA_WEBGL = 0x9241;
    GL.CONTEXT_LOST_WEBGL             = 0x9242;
    GL.UNPACK_COLORSPACE_CONVERSION_WEBGL = 0x9243;
    GL.BROWSER_DEFAULT_WEBGL          = 0x9244;

/*
    readonly attribute canvas;
    readonly attribute drawingBufferWidth;
    readonly attribute drawingBufferHeight;

    WebGLContextAttributes getContextAttributes();
    boolean isContextLost();

    DOMString[ ] getSupportedExtensions();
    object getExtension(name);
    */

    GL.activeTexture = function(texture){};
    GL.attachShader = function(program, shader){};
    GL.bindAttribLocation = function(program, index, name){};
    GL.bindBuffer = function(target, buffer){};
    GL.bindFramebuffer = function(target, framebuffer){};
    GL.bindRenderbuffer = function(target, renderbuffer){};
    GL.bindTexture = function(target, texture){};
    GL.blendColor = function(red, green, blue, alpha){};
    GL.blendEquation = function(mode){};
    GL.blendEquationSeparate = function(modeRGB, modeAlpha){};
    GL.blendFunc = function(sfactor, dfactor){};
    GL.blendFuncSeparate = function(srcRGB, dstRGB,
                           srcAlpha, dstAlpha){};

    GL.bufferData = function(target, size, usage){};
    GL.bufferData = function(target, data, usage){};
    GL.bufferData = function(target, data, usage){};
    GL.bufferSubData = function(target, offset, data){};
    GL.bufferSubData = function(target, offset, data){};

    GL.checkFramebufferStatus = function(GLenumtarget){};
    GL.clear = function(mask){};
    GL.clearColor = function(red, green, blue, alpha){};
    GL.clearDepth = function(depth){};
    GL.clearStencil = function(s){};
    GL.colorMask = function(red, green, blue, alpha){};
    GL.compileShader = function(shader){};

    GL.copyTexImage2D = function(target, level, internalformat,
                        x, y, width, height,
                        border){};
    GL.copyTexSubImage2D = function(target, level, xoffset, yoffset,
                           x, y, width, height){};

    GL.createBuffer = function(){};
    GL.createFramebuffer = function(){};
    GL.createProgram = function(){};
    GL.createRenderbuffer = function(){};
    GL.createShader = function(type){};
    GL.createTexture = function(){};

    GL.cullFace = function(mode){};

    GL.deleteBuffer = function(buffer){};
    GL.deleteFramebuffer = function(framebuffer){};
    GL.deleteProgram = function(program){};
    GL.deleteRenderbuffer = function(renderbuffer){};
    GL.deleteShader = function(shader){};
    GL.deleteTexture = function(texture){};

    GL.depthFunc = function(func){};
    GL.depthMask = function(flag){};
    GL.depthRange = function(zNear, zFar){};
    GL.detachShader = function(program, shader){};
    GL.disable = function(cap){};
    GL.disableVertexAttribArray = function(index){};
    GL.drawArrays = function(mode, first, count){};
    GL.drawElements = function(mode, count, type, offset){};

    GL.enable = function(cap){};
    GL.enableVertexAttribArray = function(index){};
    GL.finish = function(){};
    GL.flush = function(){};
    GL.framebufferRenderbuffer = function(target, attachment,
                                 renderbuffertarget,
                                 renderbuffer){};
    GL.framebufferTexture2D = function(target, attachment, textarget,
                              texture, level){};
    GL.frontFace = function(mode){};

    GL.generateMipmap = function(target){};

    GL.getActiveAttrib = function(program, index){};
    GL.getActiveUniform = function(program, index){};
    GL.getAttachedShaders = function(program){};

    GL.getAttribLocation = function(program, name){};

    GL.getParameter = function(pname){};
    GL.getBufferParameter = function(target, pname){};

    GL.GLenumgetError = function(){};

    GL.getFramebufferAttachmentParameter = function(target, attachment,
                                          pname){};
    GL.getProgramParameter = function(program, pname){};
    GL.getProgramInfoLog = function(program){};
    GL.getRenderbufferParameter = function(target, pname){};
    GL.getShaderParameter = function(shader, pname){};
    GL.getShaderInfoLog = function(shader){};

    GL.getShaderSource = function(shader){};

    GL.getTexParameter = function(target, pname){};

    GL.getUniform = function(program, location){};

    GL.getUniformLocation = function(program, name){};

    GL.getVertexAttrib = function(index, pname){};

    GL.getVertexAttribOffset = function(index, pname){};

    GL.hint = function(target, mode){};
    GL.isBuffer = function(buffer){};
    GL.isEnabled = function(cap){};
    GL.isFramebuffer = function(framebuffer){};
    GL.isProgram = function(program){};
    GL.isRenderbuffer = function(renderbuffer){};
    GL.isShader = function(shader){};
    GL.isTexture = function(texture){};
    GL.lineWidth = function(width){};
    GL.linkProgram = function(program){};
    GL.pixelStorei = function(pname, param){};
    GL.polygonOffset = function(factor, units){};

    GL.readPixels = function(x, y, width, height,
                    format, type, pixels){};

    GL.renderbufferStorage = function(target, internalformat,
                             width, height){};
    GL.sampleCoverage = function(value, invert){};
    GL.scissor = function(x, y, width, height){};

    GL.shaderSource = function(shader, source){};

    GL.stencilFunc = function(func, ref, mask){};
    GL.stencilFuncSeparate = function(face, func, ref, mask){};
    GL.stencilMask = function(mask){};
    GL.stencilMaskSeparate = function(face, mask){};
    GL.stencilOp = function(fail, zfail, zpass){};
    GL.stencilOpSeparate = function(face, fail, zfail, zpass){};

    GL.texImage2D = function(target, level, internalformat,
                    width, height, border, format,
                    type, pixels){};
    GL.texImage2D = function(target, level, internalformat,
                    format, type, pixels){};
    GL.texImage2D = function(target, level, internalformat,
                    format, type, image)
    GL.texImage2D = function(target, level, internalformat,
                    format, type, canvas)
    GL.texImage2D = function(target, level, internalformat,
                    format, type, video)

    GL.texParameterf = function(target, pname, param){};
    GL.texParameteri = function(target, pname, param){};

    GL.texSubImage2D = function(target, level, xoffset, yoffset,
                       width, height,
                       format, type, pixels){};
    GL.texSubImage2D = function(target, level, xoffset, yoffset,
                       format, type, pixels){};
    GL.texSubImage2D = function(target, level, xoffset, yoffset,
                       format, type, image)
    GL.texSubImage2D = function(target, level, xoffset, yoffset,
                       format, type, canvas)
    GL.texSubImage2D = function(target, level, xoffset, yoffset,
                       format, type, video)

    GL.uniform1f = function(location, x){};
    GL.uniform1fv = function(location, v){};
    GL.uniform1fv = function(location, v){};
    GL.uniform1i = function(location, x){};
    GL.uniform1iv = function(location, v){};
    GL.uniform1iv = function(location, v){};
    GL.uniform2f = function(location, x, y){};
    GL.uniform2fv = function(location, v){};
    GL.uniform2fv = function(location, v){};
    GL.uniform2i = function(location, x, y){};
    GL.uniform2iv = function(location, v){};
    GL.uniform2iv = function(location, v){};
    GL.uniform3f = function(location, x, y, z){};
    GL.uniform3fv = function(location, v){};
    GL.uniform3fv = function(location, v){};
    GL.uniform3i = function(location, x, y, z){};
    GL.uniform3iv = function(location, v){};
    GL.uniform3iv = function(location, v){};
    GL.uniform4f = function(location, x, y, z, w){};
    GL.uniform4fv = function(location, v){};
    GL.uniform4fv = function(location, v){};
    GL.uniform4i = function(location, x, y, z, w){};
    GL.uniform4iv = function(location, v){};
    GL.uniform4iv = function(location, v){};

    GL.uniformMatrix2fv = function(location, transpose,
                          value){};
    GL.uniformMatrix2fv = function(location, transpose,
                          value){};
    GL.uniformMatrix3fv = function(location, transpose,
                          value){};
    GL.uniformMatrix3fv = function(location, transpose,
                          value){};
    GL.uniformMatrix4fv = function(location, transpose,
                          value){};
    GL.uniformMatrix4fv = function(location, transpose,
                          value){};

    GL.useProgram = function(program){};
    GL.validateProgram = function(program){};

    GL.vertexAttrib1f = function(indx, x){};
    GL.vertexAttrib1fv = function(indx, values){};
    GL.vertexAttrib1fv = function(indx, values){};
    GL.vertexAttrib2f = function(indx, x, y){};
    GL.vertexAttrib2fv = function(indx, values){};
    GL.vertexAttrib2fv = function(indx, values){};
    GL.vertexAttrib3f = function(indx, x, y, z){};
    GL.vertexAttrib3fv = function(indx, values){};
    GL.vertexAttrib3fv = function(indx, values){};
    GL.vertexAttrib4f = function(indx, x, y, z, w){};
    GL.vertexAttrib4fv = function(indx, values){};
    GL.vertexAttrib4fv = function(indx, values){};
    GL.vertexAttribPointer = function(indx, size, type,
                             normalized, stride, offset){};

    GL.viewport = function(x, y, width, height){};


/**
 * TYPES
 */
HTMLCanvasElement = HTMLCanvasElement || {};
HTMLImageElement = HTMLImageElement || {};
HTMLVideoElement = HTMLVideoElement || {};
ImageData = ImageData || {};
GLenum = GLenum || Number;
GLboolean = GLboolean || Boolean;
GLbitfield = GLbitfield || Number;
GLbyte = GLbyte || Number;         /* 'byte' should be a signed 8 bit type. */
GLshort =  GLshort || Number;
GLint = GLint || Number;
GLsizei = GLsizei || Number;
GLintptr = GLintptr || Number;
GLsizeiptr = GLsizeiptr || Number;
GLubyte = GLubyte || Number;        /* 'unsigned byte' should be an unsigned 8 bit type. */
GLushort = GLushort || Number;
GLuint = GLuint || Number;
GLfloat = GLfloat || Number;
GLclampf = GLclampf || Number;

/**
 * WebGLContextAttributes
 */
WebGLContextAttributes = WebGLContextAttributes || {
    alpha: false,
    depth: false,
    stencil: false,
    antialias: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: false
}

/**
 * WebGLObject
 */
WebGLObject = WebGLObject || {};


/******
 TYPED ARRAYS
 */
Int8Array = Int8Array || [];
Uint8Array = Uint8Array || [];
Int16Array = Int16Array || [];
Uint16Array = Uint16Array || [];
Int32Array = Int32Array || [];
Uint32Array = Uint32Array || [];
Float32Array = Float32Array  || [];
Float64Array = Float64Array || [];

/**
 RESERVED WORDS
 */
