export interface httpbinResponse {
    args: object;
    data: string;
    files: object;
    form: object;
    headers: Headers;
    json: object;
    method: string;
    origin: string;
    url: string;
}