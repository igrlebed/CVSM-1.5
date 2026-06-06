export interface ProjectsOverviewRow {
  id: string
  label: string
  multiline?: boolean
  emphasis?: boolean
  values: Record<string, string>
}

export interface ProjectsOverviewGroup {
  id: string
  title: string
  rows: ProjectsOverviewRow[]
}
