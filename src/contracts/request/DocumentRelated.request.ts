export type DocId = {
  id: string,
  signed_url: string,
}

export type DocumentCreateRequest = {
  title: string,
  doc_id: DocId[],
  form_attr: string,
}

export type DocumentUpdateRequest = {
  url_doc_status: boolean,
}