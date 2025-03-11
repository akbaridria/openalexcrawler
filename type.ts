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

export interface ResponseJournal {
  id: string
  issn_l: string
  issn: string[]
  display_name: string
  host_organization: string
  host_organization_name: string
  host_organization_lineage: string[]
  works_count: number
  cited_by_count: number
  summary_stats: SummaryStats
  is_oa: boolean
  is_in_doaj: boolean
  is_indexed_in_scopus: boolean
  is_core: boolean
  ids: Ids
  homepage_url: string
  apc_prices: any
  apc_usd: any
  country_code: string
  societies: any[]
  alternate_titles: string[]
  abbreviated_title: any
  type: string
  topics: Topic[]
  topic_share: TopicShare[]
  x_concepts: XConcept[]
  counts_by_year: CountsByYear[]
  works_api_url: string
  updated_date: string
  created_date: string
}

export interface SummaryStats {
  "2yr_mean_citedness": number
  h_index: number
  i10_index: number
}

export interface Ids {
  openalex: string
  issn_l: string
  issn: string[]
  mag: string
  wikidata: string
}

export interface Topic {
  id: string
  display_name: string
  count: number
  subfield: Subfield
  field: Field
  domain: Domain
}

export interface Subfield {
  id: string
  display_name: string
}

export interface Field {
  id: string
  display_name: string
}

export interface Domain {
  id: string
  display_name: string
}

export interface TopicShare {
  id: string
  display_name: string
  value: number
  subfield: Subfield2
  field: Field2
  domain: Domain2
}

export interface Subfield2 {
  id: string
  display_name: string
}

export interface Field2 {
  id: string
  display_name: string
}

export interface Domain2 {
  id: string
  display_name: string
}

export interface XConcept {
  id: string
  wikidata: string
  display_name: string
  level: number
  score: number
}

export interface CountsByYear {
  year: number
  works_count: number
  cited_by_count: number
}

export interface ResponsePublisher {
  id: string
  display_name: string
  alternate_titles: string[]
  hierarchy_level: number
  parent_publisher: any
  lineage: string[]
  country_codes: string[]
  homepage_url: string
  image_url: string
  image_thumbnail_url: string
  works_count: number
  cited_by_count: number
  summary_stats: SummaryStats
  ids: Ids
  counts_by_year: CountsByYear[]
  roles: Role[]
  sources_api_url: string
  updated_date: string
  created_date: string
}

export interface SummaryStats {
  "2yr_mean_citedness": number
  h_index: number
  i10_index: number
}

export interface Ids {
  openalex: string
  ror: string
  wikidata: string
}

export interface CountsByYear {
  year: number
  works_count: number
  cited_by_count: number
}

export interface Role {
  role: string
  id: string
  works_count: number
}

export interface ResponseAuthor {
  id: string
  orcid: string
  display_name: string
  display_name_alternatives: string[]
  works_count: number
  cited_by_count: number
  summary_stats: SummaryStats
  ids: Ids
  affiliations: Affiliation[]
  last_known_institutions: LastKnownInstitution[]
  topics: Topic[]
  topic_share: TopicShare[]
  x_concepts: XConcept[]
  counts_by_year: CountsByYear[]
  works_api_url: string
  updated_date: string
  created_date: string
}

export interface SummaryStats {
  "2yr_mean_citedness": number
  h_index: number
  i10_index: number
}

export interface Ids {
  openalex: string
  orcid: string
}

export interface Affiliation {
  institution: Institution
  years: number[]
}

export interface LastKnownInstitution {
  id: string
  ror: string
  display_name: string
  country_code: any
  type: string
  lineage: string[]
}

export interface Topic {
  id: string
  display_name: string
  count: number
  subfield: Subfield
  field: Field
  domain: Domain
}

export interface Subfield {
  id: string
  display_name: string
}

export interface Field {
  id: string
  display_name: string
}

export interface Domain {
  id: string
  display_name: string
}

export interface TopicShare {
  id: string
  display_name: string
  value: number
  subfield: Subfield2
  field: Field2
  domain: Domain2
}

export interface Subfield2 {
  id: string
  display_name: string
}

export interface Field2 {
  id: string
  display_name: string
}

export interface Domain2 {
  id: string
  display_name: string
}

export interface XConcept {
  id: string
  wikidata: string
  display_name: string
  level: number
  score: number
}

export interface CountsByYear {
  year: number
  works_count: number
  cited_by_count: number
}

export interface ResponseInstitution {
  id: string
  ror: string
  display_name: string
  country_code: string
  type: string
  type_id: string
  lineage: string[]
  homepage_url: string
  image_url: string
  image_thumbnail_url: string
  display_name_acronyms: any[]
  display_name_alternatives: string[]
  repositories: any[]
  works_count: number
  cited_by_count: number
  summary_stats: SummaryStats
  ids: Ids
  geo: Geo
  international: International
  associated_institutions: AssociatedInstitution[]
  counts_by_year: CountsByYear[]
  roles: Role[]
  topics: Topic[]
  topic_share: TopicShare[]
  x_concepts: XConcept[]
  is_super_system: boolean
  works_api_url: string
  updated_date: string
  created_date: string
}

export interface SummaryStats {
  "2yr_mean_citedness": number
  h_index: number
  i10_index: number
}

export interface Ids {
  openalex: string
  ror: string
  mag: string
  grid: string
  wikipedia: string
  wikidata: string
}

export interface Geo {
  city: string
  geonames_city_id: string
  region: any
  country_code: string
  country: string
  latitude: number
  longitude: number
}

export interface International {
  display_name: DisplayName
}

export interface DisplayName {
  af: string
  ar: string
  arz: string
  az: string
  azb: string
  bg: string
  bn: string
  br: string
  bs: string
  ca: string
  cs: string
  da: string
  de: string
  el: string
  en: string
  "en-ca": string
  "en-gb": string
  eo: string
  es: string
  et: string
  eu: string
  fa: string
  fi: string
  fr: string
  ga: string
  gan: string
  gl: string
  he: string
  hr: string
  hu: string
  hy: string
  hyw: string
  id: string
  it: string
  ja: string
  ka: string
  kk: string
  "kk-arab": string
  "kk-cn": string
  "kk-cyrl": string
  "kk-kz": string
  "kk-latn": string
  "kk-tr": string
  ko: string
  lb: string
  lv: string
  ml: string
  ms: string
  mul: string
  nan: string
  nb: string
  nl: string
  oc: string
  pl: string
  pt: string
  "pt-br": string
  qu: string
  ro: string
  sah: string
  sco: string
  sh: string
  sk: string
  sl: string
  sq: string
  sr: string
  "sr-ec": string
  "sr-el": string
  sv: string
  ta: string
  te: string
  th: string
  tr: string
  tt: string
  "tt-cyrl": string
  ur: string
  uz: string
  vec: string
  vi: string
  wuu: string
  yue: string
  zh: string
  "zh-cn": string
  "zh-hans": string
  "zh-hant": string
  "zh-hk": string
  "zh-sg": string
  "zh-tw": string
}

export interface AssociatedInstitution {
  id: string
  ror: string
  display_name: string
  country_code: string
  type: string
  relationship: string
}

export interface CountsByYear {
  year: number
  works_count: number
  cited_by_count: number
}

export interface Role {
  role: string
  id: string
  works_count: number
}

export interface Topic {
  id: string
  display_name: string
  count: number
  subfield: Subfield
  field: Field
  domain: Domain
}

export interface Subfield {
  id: string
  display_name: string
}

export interface Field {
  id: string
  display_name: string
}

export interface Domain {
  id: string
  display_name: string
}

export interface TopicShare {
  id: string
  display_name: string
  value: number
  subfield: Subfield2
  field: Field2
  domain: Domain2
}

export interface Subfield2 {
  id: string
  display_name: string
}

export interface Field2 {
  id: string
  display_name: string
}

export interface Domain2 {
  id: string
  display_name: string
}

export interface XConcept {
  id: string
  wikidata: string
  display_name: string
  level: number
  score: number
}
