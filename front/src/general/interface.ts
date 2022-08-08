export interface IDetail {
    drawing: string;
    id: number;
    ident: number;
    index: number;
    path: string;
    relevance: any;
    title: string;
    type: string;
}

export interface ITech {
    company: string;
    creater: string;
    creater_id: number;
    date: string;
    description: string;
    detail_id: number;
    en: string;
    ev: string;
    id: number;
    kd: string;
    kim: string;
    kod: string;
    kod_zag: string;
    last_mod: string;
    litera: string;
    manufacturer: string;
    md: string;
    mz: string;
    n_rash: string;
    name: string;
    opt: string;
    profil_i_razmer: string;
    sortament: string;
    status_tech: string;
    title: string;
    version: any
}

interface IPagePanel {
    label: string,
    page: number,
    pageCount: number,
    listLen: number,
}