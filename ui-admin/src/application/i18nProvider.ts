import type { I18nProvider } from "react-admin";

type TranslateOptions = Record<string, unknown> & { _: string };

const ptPT = {
  ra: {
    action: {
      add_filter: "Adicionar filtro",
      back: "Voltar",
      cancel: "Cancelar",
      clear_input_value: "Limpar",
      close: "Fechar",
      close_menu: "Fechar menu",
      collapse: "Recolher",
      create: "Criar",
      delete: "Eliminar",
      edit: "Editar",
      expand: "Expandir",
      export: "Exportar",
      list: "Lista",
      open_menu: "Abrir menu",
      refresh: "Atualizar",
      remove_filter: "Remover filtro",
      save: "Guardar",
      search: "Pesquisar",
      show: "Ver",
      sort: "Ordenar",
      submit: "Submeter",
      undo: "Anular",
      update: "Atualizar",
    },
    auth: {
      auth_check_error: "Sessão expirada. Inicie sessão novamente.",
      user_menu: "Perfil",
      username: "Utilizador",
      password: "Palavra-passe",
      sign_in: "Iniciar sessão",
      sign_in_error: "Credenciais inválidas",
      logout: "Terminar sessão",
    },
    input: {
      password: {
        toggle_hidden: "Mostrar palavra-passe",
      },
      file: {
        upload_several: "Arraste os ficheiros ou clique para selecionar.",
        upload_single: "Arraste o ficheiro ou clique para selecionar.",
        accept: "Aceites: %{types}",
      },
    },
    message: {
      access_denied: "Acesso negado.",
      error: "Erro.",
      invalid_form: "O formulário tem erros.",
      loading: "A carregar...",
      not_found: "Não encontrado.",
      unsaved_changes: "Tem alterações por guardar.",
    },
    notification: {
      created: "Criado com sucesso.",
      updated: "Atualizado com sucesso.",
      deleted: "Eliminado com sucesso.",
      bad_item: "Elemento inválido.",
      item_doesnt_exist: "O elemento já não existe.",
      http_error: "Erro de comunicação com o servidor.",
      data_provider_error: "Erro no fornecedor de dados. Consulte a consola.",
      canceled: "Ação cancelada.",
    },
    navigation: {
      first: "Primeira",
      last: "Última",
      next: "Seguinte",
      no_results: "Sem resultados.",
      no_filtered_results:
        "Nenhum resultado encontrado com os filtros atuais.",
      clear_filters: "Limpar filtros",
      page_range_info: "%{offsetBegin}-%{offsetEnd} de %{total}",
      page_rows_per_page: "Linhas por página",
      prev: "Anterior",
    },
    page: {
      create: "Criar %{name}",
      dashboard: "Página inicial",
      edit: "Editar %{name} #%{id}",
      error: "Ocorreu um erro",
      list: "%{name}",
      loading: "A carregar",
      not_found: "Não encontrado",
      show: "Ver %{name} #%{id}",
      empty: "Nenhum registo encontrado",
      invite: "Clique para adicionar um novo item",
    },
    validation: {
      email: "Email inválido.",
      maxLength: "Deve ter no máximo %{max} caracteres.",
      maxValue: "Deve ser no máximo %{max}.",
      minLength: "Deve ter pelo menos %{min} caracteres.",
      minValue: "Deve ser no mínimo %{min}.",
      number: "Deve ser um número.",
      regex: "Formato inválido.",
      required: "Obrigatório.",
      url: "URL inválido.",
    },
  },
};

const messages = {
  "pt-PT": ptPT,
} as const;

let currentLocale: keyof typeof messages = "pt-PT";

const getMessage = (key: string) => {
  const parts = key.split(".");
  let current: unknown = messages[currentLocale];
  for (const part of parts) {
    if (typeof current !== "object" || current === null) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }
  return current;
};

const interpolate = (message: string, options?: TranslateOptions) =>
  message.replace(/%\{(.+?)\}/g, (match, key) => {
    const value = options?.[key];
    return value === undefined || value === null ? match : String(value);
  });

export const i18nProvider: I18nProvider = {
  translate: (key: string, options?: TranslateOptions) => {
    const message = getMessage(key);
    if (typeof message === "string") {
      return interpolate(message, options);
    }
    if (options?._) {
      return interpolate(options._, options);
    }
    return key;
  },
  changeLocale: async (locale: string) => {
    currentLocale =
      locale in messages ? (locale as keyof typeof messages) : "pt-PT";
  },
  getLocale: () => currentLocale,
};
