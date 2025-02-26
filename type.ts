export interface Publication {
  id: string;
  title: string;
  publication_date: string;
  language: string;
  primary_location: PrimaryLocation;
  type: string;
  open_access: OpenAccess;
  authorships: Authorship[];
  abstract_inverted_index?: { [key: string] : any }
}

export interface PrimaryLocation {
  is_oa: boolean;
  landing_page_url: string;
  pdf_url?: any;
  source?: Source;
  license?: any;
  license_id?: any;
  version?: any;
  is_accepted: boolean;
  is_published: boolean;
}

export interface Source {
  id: string;
  display_name: string;
  issn_l: string;
  issn: string[];
  is_oa: boolean;
  is_in_doaj: boolean;
  is_indexed_in_scopus: boolean;
  is_core: boolean;
  host_organization: string;
  host_organization_name: string;
  host_organization_lineage: string[];
  host_organization_lineage_names: string[];
  type: string;
}

export interface OpenAccess {
  is_oa: boolean;
  oa_status: string;
  oa_url: string;
  any_repository_has_fulltext: boolean;
}

export interface Authorship {
  author_position: string;
  author: Author;
  institutions: Institution[];
  countries: string[];
  is_corresponding: boolean;
  raw_author_name: string;
  raw_affiliation_strings: string[];
  affiliations: Affiliation[];
}

export interface Author {
  id: string;
  display_name: string;
  orcid?: string;
}

export interface Institution {
  id: string;
  display_name: string;
  ror: string;
  country_code: string;
  type: string;
  lineage: string[];
}

export interface Affiliation {
  raw_affiliation_string: string;
  institution_ids: string[];
}

export interface Meta {
  count: number;
  db_response_time_ms: number;
  page: number;
  per_page: number;
  groups_count?: any;
  next_cursor: string | null;
}

export interface ResponseTypes {
  results: Publication[];
  meta: Meta;
}
