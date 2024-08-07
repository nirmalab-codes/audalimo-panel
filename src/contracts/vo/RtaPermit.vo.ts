export type RtaPermitIdVo = {
    id: string;
    signedUrl: string;
};

export type RtaPermitVo = {
    rtaPermitId: RtaPermitIdVo[];
};

export function getDefaultRtaPermitVo(): RtaPermitVo {
    return {
        rtaPermitId: [],
    };
}