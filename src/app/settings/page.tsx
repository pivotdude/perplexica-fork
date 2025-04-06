'use client';

import { Settings as SettingsIcon, ArrowLeft, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Switch } from '@headlessui/react';
import ThemeSwitcher from '@/components/theme/Switcher';
import { ImagesIcon, VideoIcon } from 'lucide-react';
import Link from 'next/link';
import AuthLayout from '@/components/AuthLayout';
import { LoadingScreen } from '@/components/ui/LoaderScreen';

interface SettingsType {
  chatModelProviders: {
    [key: string]: Record<string, any>[];
  };
  embeddingModelProviders: {
    [key: string]: Record<string, any>[];
  };
  openaiApiKey: string;
  groqApiKey: string;
  anthropicApiKey: string;
  geminiApiKey: string;
  ollamaApiUrl: string;
  deepseekApiKey: string;
  customOpenaiApiKey: string;
  customOpenaiApiUrl: string;
  customOpenaiModelName: string;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isSaving?: boolean;
  onSave?: (value: string) => void;
}

const Input = ({ className, isSaving, onSave, ...restProps }: InputProps) => {
  return (
    <div className="relative">
      <input
        {...restProps}
        className={cn(
          'bg-light-secondary dark:bg-dark-secondary w-full px-3 py-2 flex items-center overflow-hidden border border-light-200 dark:border-dark-200 dark:text-white rounded-lg text-sm',
          isSaving && 'pr-10',
          className,
        )}
        onBlur={(e) => onSave?.(e.target.value)}
      />
      {isSaving && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Loader2
            size={16}
            className="animate-spin text-black/70 dark:text-white/70"
          />
        </div>
      )}
    </div>
  );
};

interface TextareaProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  isSaving?: boolean;
  onSave?: (value: string) => void;
}

const Textarea = ({
  className,
  isSaving,
  onSave,
  ...restProps
}: TextareaProps) => {
  return (
    <div className="relative">
      <textarea
        placeholder="Any special instructions for the LLM"
        className="placeholder:text-sm text-sm w-full flex items-center justify-between p-3 bg-light-secondary dark:bg-dark-secondary rounded-lg hover:bg-light-200 dark:hover:bg-dark-200 transition-colors"
        rows={4}
        onBlur={(e) => onSave?.(e.target.value)}
        {...restProps}
      />
      {isSaving && (
        <div className="absolute right-3 top-3">
          <Loader2
            size={16}
            className="animate-spin text-black/70 dark:text-white/70"
          />
        </div>
      )}
    </div>
  );
};

const Select = ({
  className,
  options,
  ...restProps
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  options: { value: string; label: string; disabled?: boolean }[];
}) => {
  return (
    <select
      {...restProps}
      className={cn(
        'bg-light-secondary dark:bg-dark-secondary px-3 py-2 flex items-center overflow-hidden border border-light-200 dark:border-dark-200 dark:text-white rounded-lg text-sm',
        className,
      )}
    >
      {options.map(({ label, value, disabled }) => (
        <option key={value} value={value} disabled={disabled}>
          {label}
        </option>
      ))}
    </select>
  );
};

const SettingsSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col space-y-4 p-4 bg-light-secondary/50 dark:bg-dark-secondary/50 rounded-xl border border-light-200 dark:border-dark-200">
    <h2 className="text-black/90 dark:text-white/90 font-medium">{title}</h2>
    {children}
  </div>
);

const Page = () => {
  const [config, setConfig] = useState<SettingsType | null>(null);
  const [chatModels, setChatModels] = useState<Record<string, any>>({});
  const [embeddingModels, setEmbeddingModels] = useState<Record<string, any>>(
    {},
  );
  const [selectedChatModelProvider, setSelectedChatModelProvider] = useState<
    string | null
  >(null);
  const [selectedChatModel, setSelectedChatModel] = useState<string | null>(
    null,
  );
  const [selectedEmbeddingModelProvider, setSelectedEmbeddingModelProvider] =
    useState<string | null>(null);
  const [selectedEmbeddingModel, setSelectedEmbeddingModel] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [automaticImageSearch, setAutomaticImageSearch] = useState(false);
  const [automaticVideoSearch, setAutomaticVideoSearch] = useState(false);
  const [systemInstructions, setSystemInstructions] = useState<string>('');
  const [savingStates, setSavingStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchConfig = async () => {
      setIsLoading(true);
      const res = await fetch(`/api/config`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = (await res.json()) as SettingsType;
      setConfig(data);

      const chatModelProvidersKeys = Object.keys(data.chatModelProviders || {});
      const embeddingModelProvidersKeys = Object.keys(
        data.embeddingModelProviders || {},
      );

      const defaultChatModelProvider =
        chatModelProvidersKeys.length > 0 ? chatModelProvidersKeys[0] : '';
      const defaultEmbeddingModelProvider =
        embeddingModelProvidersKeys.length > 0
          ? embeddingModelProvidersKeys[0]
          : '';

      const chatModelProvider =
        localStorage.getItem('chatModelProvider') ||
        defaultChatModelProvider ||
        '';
      const chatModel =
        localStorage.getItem('chatModel') ||
        (data.chatModelProviders &&
        data.chatModelProviders[chatModelProvider]?.length > 0
          ? data.chatModelProviders[chatModelProvider][0].name
          : undefined) ||
        '';
      const embeddingModelProvider =
        localStorage.getItem('embeddingModelProvider') ||
        defaultEmbeddingModelProvider ||
        '';
      const embeddingModel =
        localStorage.getItem('embeddingModel') ||
        (data.embeddingModelProviders &&
          data.embeddingModelProviders[embeddingModelProvider]?.[0].name) ||
        '';

      setSelectedChatModelProvider(chatModelProvider);
      setSelectedChatModel(chatModel);
      setSelectedEmbeddingModelProvider(embeddingModelProvider);
      setSelectedEmbeddingModel(embeddingModel);
      setChatModels(data.chatModelProviders || {});
      setEmbeddingModels(data.embeddingModelProviders || {});

      setAutomaticImageSearch(
        localStorage.getItem('autoImageSearch') === 'true',
      );
      setAutomaticVideoSearch(
        localStorage.getItem('autoVideoSearch') === 'true',
      );

      setSystemInstructions(localStorage.getItem('systemInstructions')!);

      setIsLoading(false);
    };

    fetchConfig();
  }, []);

  const saveConfig = async (key: string, value: any) => {
    setSavingStates((prev) => ({ ...prev, [key]: true }));

    try {
      const updatedConfig = {
        ...config,
        [key]: value,
      } as SettingsType;

      const response = await fetch(`/api/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedConfig),
      });

      if (!response.ok) {
        throw new Error('Failed to update config');
      }

      setConfig(updatedConfig);

      if (
        key.toLowerCase().includes('api') ||
        key.toLowerCase().includes('url')
      ) {
        const res = await fetch(`/api/config`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch updated config');
        }

        const data = await res.json();

        setChatModels(data.chatModelProviders || {});
        setEmbeddingModels(data.embeddingModelProviders || {});

        const currentChatProvider = selectedChatModelProvider;
        const newChatProviders = Object.keys(data.chatModelProviders || {});

        if (!currentChatProvider && newChatProviders.length > 0) {
          const firstProvider = newChatProviders[0];
          const firstModel = data.chatModelProviders[firstProvider]?.[0]?.name;

          if (firstModel) {
            setSelectedChatModelProvider(firstProvider);
            setSelectedChatModel(firstModel);
            localStorage.setItem('chatModelProvider', firstProvider);
            localStorage.setItem('chatModel', firstModel);
          }
        } else if (
          currentChatProvider &&
          (!data.chatModelProviders ||
            !data.chatModelProviders[currentChatProvider] ||
            !Array.isArray(data.chatModelProviders[currentChatProvider]) ||
            data.chatModelProviders[currentChatProvider].length === 0)
        ) {
          const firstValidProvider = Object.entries(
            data.chatModelProviders || {},
          ).find(
            ([_, models]) => Array.isArray(models) && models.length > 0,
          )?.[0];

          if (firstValidProvider) {
            setSelectedChatModelProvider(firstValidProvider);
            setSelectedChatModel(
              data.chatModelProviders[firstValidProvider][0].name,
            );
            localStorage.setItem('chatModelProvider', firstValidProvider);
            localStorage.setItem(
              'chatModel',
              data.chatModelProviders[firstValidProvider][0].name,
            );
          } else {
            setSelectedChatModelProvider(null);
            setSelectedChatModel(null);
            localStorage.removeItem('chatModelProvider');
            localStorage.removeItem('chatModel');
          }
        }

        const currentEmbeddingProvider = selectedEmbeddingModelProvider;
        const newEmbeddingProviders = Object.keys(
          data.embeddingModelProviders || {},
        );

        if (!currentEmbeddingProvider && newEmbeddingProviders.length > 0) {
          const firstProvider = newEmbeddingProviders[0];
          const firstModel =
            data.embeddingModelProviders[firstProvider]?.[0]?.name;

          if (firstModel) {
            setSelectedEmbeddingModelProvider(firstProvider);
            setSelectedEmbeddingModel(firstModel);
            localStorage.setItem('embeddingModelProvider', firstProvider);
            localStorage.setItem('embeddingModel', firstModel);
          }
        } else if (
          currentEmbeddingProvider &&
          (!data.embeddingModelProviders ||
            !data.embeddingModelProviders[currentEmbeddingProvider] ||
            !Array.isArray(
              data.embeddingModelProviders[currentEmbeddingProvider],
            ) ||
            data.embeddingModelProviders[currentEmbeddingProvider].length === 0)
        ) {
          const firstValidProvider = Object.entries(
            data.embeddingModelProviders || {},
          ).find(
            ([_, models]) => Array.isArray(models) && models.length > 0,
          )?.[0];

          if (firstValidProvider) {
            setSelectedEmbeddingModelProvider(firstValidProvider);
            setSelectedEmbeddingModel(
              data.embeddingModelProviders[firstValidProvider][0].name,
            );
            localStorage.setItem('embeddingModelProvider', firstValidProvider);
            localStorage.setItem(
              'embeddingModel',
              data.embeddingModelProviders[firstValidProvider][0].name,
            );
          } else {
            setSelectedEmbeddingModelProvider(null);
            setSelectedEmbeddingModel(null);
            localStorage.removeItem('embeddingModelProvider');
            localStorage.removeItem('embeddingModel');
          }
        }

        setConfig(data);
      }

      if (key === 'automaticImageSearch') {
        localStorage.setItem('autoImageSearch', value.toString());
      } else if (key === 'automaticVideoSearch') {
        localStorage.setItem('autoVideoSearch', value.toString());
      } else if (key === 'chatModelProvider') {
        localStorage.setItem('chatModelProvider', value);
      } else if (key === 'chatModel') {
        localStorage.setItem('chatModel', value);
      } else if (key === 'embeddingModelProvider') {
        localStorage.setItem('embeddingModelProvider', value);
      } else if (key === 'embeddingModel') {
        localStorage.setItem('embeddingModel', value);
      } else if (key === 'systemInstructions') {
        localStorage.setItem('systemInstructions', value);
      }
    } catch (err) {
      console.error('Failed to save:', err);
      setConfig((prev) => ({ ...prev! }));
    } finally {
      setTimeout(() => {
        setSavingStates((prev) => ({ ...prev, [key]: false }));
      }, 500);
    }
  };

  return (
    <AuthLayout>
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col pt-4">
          <div className="flex items-center space-x-2">
            <Link href="/" className="lg:hidden">
              <ArrowLeft className="text-black/70 dark:text-white/70" />
            </Link>
            <div className="flex flex-row space-x-0.5 items-center">
              <SettingsIcon size={23} />
              <h1 className="text-3xl font-medium p-2">Settings</h1>
            </div>
          </div>
          <hr className="border-t border-[#2B2C2C] my-4 w-full" />
        </div>

        {isLoading ? (
          <LoadingScreen />
        ) : (
          config && (
            <div className="flex flex-col space-y-6 pb-28 lg:pb-8">
              <SettingsSection title="Appearance">
                <div className="flex flex-col space-y-1">
                  <p className="text-black/70 dark:text-white/70 text-sm">
                    Theme
                  </p>
                  <ThemeSwitcher />
                </div>
              </SettingsSection>

              <SettingsSection title="Automatic Search">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between p-3 bg-light-secondary dark:bg-dark-secondary rounded-lg hover:bg-light-200 dark:hover:bg-dark-200 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-light-200 dark:bg-dark-200 rounded-lg">
                        <ImagesIcon
                          size={18}
                          className="text-black/70 dark:text-white/70"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-black/90 dark:text-white/90 font-medium">
                          Automatic Image Search
                        </p>
                        <p className="text-xs text-black/60 dark:text-white/60 mt-0.5">
                          Automatically search for relevant images in chat
                          responses
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={automaticImageSearch}
                      onChange={(checked) => {
                        setAutomaticImageSearch(checked);
                        saveConfig('automaticImageSearch', checked);
                      }}
                      className={cn(
                        automaticImageSearch
                          ? 'bg-[#24A0ED]'
                          : 'bg-light-200 dark:bg-dark-200',
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none',
                      )}
                    >
                      <span
                        className={cn(
                          automaticImageSearch
                            ? 'translate-x-6'
                            : 'translate-x-1',
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                        )}
                      />
                    </Switch>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-light-secondary dark:bg-dark-secondary rounded-lg hover:bg-light-200 dark:hover:bg-dark-200 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-light-200 dark:bg-dark-200 rounded-lg">
                        <VideoIcon
                          size={18}
                          className="text-black/70 dark:text-white/70"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-black/90 dark:text-white/90 font-medium">
                          Automatic Video Search
                        </p>
                        <p className="text-xs text-black/60 dark:text-white/60 mt-0.5">
                          Automatically search for relevant videos in chat
                          responses
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={automaticVideoSearch}
                      onChange={(checked) => {
                        setAutomaticVideoSearch(checked);
                        saveConfig('automaticVideoSearch', checked);
                      }}
                      className={cn(
                        automaticVideoSearch
                          ? 'bg-[#24A0ED]'
                          : 'bg-light-200 dark:bg-dark-200',
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none',
                      )}
                    >
                      <span
                        className={cn(
                          automaticVideoSearch
                            ? 'translate-x-6'
                            : 'translate-x-1',
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                        )}
                      />
                    </Switch>
                  </div>
                </div>
              </SettingsSection>

              <SettingsSection title="System Instructions">
                <div className="flex flex-col space-y-4">
                  <Textarea
                    value={systemInstructions}
                    isSaving={savingStates['systemInstructions']}
                    onChange={(e) => {
                      setSystemInstructions(e.target.value);
                    }}
                    onSave={(value) => saveConfig('systemInstructions', value)}
                  />
                </div>
              </SettingsSection>

              <SettingsSection title="Model Settings">
                {config.chatModelProviders && (
                  <div className="flex flex-col space-y-4">
                    <div className="flex flex-col space-y-1">
                      <p className="text-black/70 dark:text-white/70 text-sm">
                        Chat Model Provider
                      </p>
                      <Select
                        value={selectedChatModelProvider ?? undefined}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedChatModelProvider(value);
                          saveConfig('chatModelProvider', value);
                          const firstModel =
                            config.chatModelProviders[value]?.[0]?.name;
                          if (firstModel) {
                            setSelectedChatModel(firstModel);
                            saveConfig('chatModel', firstModel);
                          }
                        }}
                        options={Object.keys(config.chatModelProviders).map(
                          (provider) => ({
                            value: provider,
                            label:
                              provider.charAt(0).toUpperCase() +
                              provider.slice(1),
                          }),
                        )}
                      />
                    </div>

                    {selectedChatModelProvider &&
                      selectedChatModelProvider != 'custom_openai' && (
                        <div className="flex flex-col space-y-1">
                          <p className="text-black/70 dark:text-white/70 text-sm">
                            Chat Model
                          </p>
                          <Select
                            value={selectedChatModel ?? undefined}
                            onChange={(e) => {
                              const value = e.target.value;
                              setSelectedChatModel(value);
                              saveConfig('chatModel', value);
                            }}
                            options={(() => {
                              const chatModelProvider =
                                config.chatModelProviders[
                                  selectedChatModelProvider
                                ];
                              return chatModelProvider
                                ? chatModelProvider.length > 0
                                  ? chatModelProvider.map((model) => ({
                                      value: model.name,
                                      label: model.displayName,
                                    }))
                                  : [
                                      {
                                        value: '',
                                        label: 'No models available',
                                        disabled: true,
                                      },
                                    ]
                                : [
                                    {
                                      value: '',
                                      label:
                                        'Invalid provider, please check backend logs',
                                      disabled: true,
                                    },
                                  ];
                            })()}
                          />
                        </div>
                      )}
                  </div>
                )}

                {selectedChatModelProvider &&
                  selectedChatModelProvider === 'custom_openai' && (
                    <div className="flex flex-col space-y-4">
                      <div className="flex flex-col space-y-1">
                        <p className="text-black/70 dark:text-white/70 text-sm">
                          Model Name
                        </p>
                        <Input
                          type="text"
                          placeholder="Model name"
                          value={config.customOpenaiModelName}
                          isSaving={savingStates['customOpenaiModelName']}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            setConfig((prev) => ({
                              ...prev!,
                              customOpenaiModelName: e.target.value,
                            }));
                          }}
                          onSave={(value) =>
                            saveConfig('customOpenaiModelName', value)
                          }
                        />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <p className="text-black/70 dark:text-white/70 text-sm">
                          Custom OpenAI API Key
                        </p>
                        <Input
                          type="text"
                          placeholder="Custom OpenAI API Key"
                          value={config.customOpenaiApiKey}
                          isSaving={savingStates['customOpenaiApiKey']}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            setConfig((prev) => ({
                              ...prev!,
                              customOpenaiApiKey: e.target.value,
                            }));
                          }}
                          onSave={(value) =>
                            saveConfig('customOpenaiApiKey', value)
                          }
                        />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <p className="text-black/70 dark:text-white/70 text-sm">
                          Custom OpenAI Base URL
                        </p>
                        <Input
                          type="text"
                          placeholder="Custom OpenAI Base URL"
                          value={config.customOpenaiApiUrl}
                          isSaving={savingStates['customOpenaiApiUrl']}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            setConfig((prev) => ({
                              ...prev!,
                              customOpenaiApiUrl: e.target.value,
                            }));
                          }}
                          onSave={(value) =>
                            saveConfig('customOpenaiApiUrl', value)
                          }
                        />
                      </div>
                    </div>
                  )}

                {config.embeddingModelProviders && (
                  <div className="flex flex-col space-y-4 mt-4 pt-4 border-t border-light-200 dark:border-dark-200">
                    <div className="flex flex-col space-y-1">
                      <p className="text-black/70 dark:text-white/70 text-sm">
                        Embedding Model Provider
                      </p>
                      <Select
                        value={selectedEmbeddingModelProvider ?? undefined}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedEmbeddingModelProvider(value);
                          saveConfig('embeddingModelProvider', value);
                          const firstModel =
                            config.embeddingModelProviders[value]?.[0]?.name;
                          if (firstModel) {
                            setSelectedEmbeddingModel(firstModel);
                            saveConfig('embeddingModel', firstModel);
                          }
                        }}
                        options={Object.keys(
                          config.embeddingModelProviders,
                        ).map((provider) => ({
                          value: provider,
                          label:
                            provider.charAt(0).toUpperCase() +
                            provider.slice(1),
                        }))}
                      />
                    </div>

                    {selectedEmbeddingModelProvider && (
                      <div className="flex flex-col space-y-1">
                        <p className="text-black/70 dark:text-white/70 text-sm">
                          Embedding Model
                        </p>
                        <Select
                          value={selectedEmbeddingModel ?? undefined}
                          onChange={(e) => {
                            const value = e.target.value;
                            setSelectedEmbeddingModel(value);
                            saveConfig('embeddingModel', value);
                          }}
                          options={(() => {
                            const embeddingModelProvider =
                              config.embeddingModelProviders[
                                selectedEmbeddingModelProvider
                              ];
                            return embeddingModelProvider
                              ? embeddingModelProvider.length > 0
                                ? embeddingModelProvider.map((model) => ({
                                    value: model.name,
                                    label: model.displayName,
                                  }))
                                : [
                                    {
                                      value: '',
                                      label: 'No models available',
                                      disabled: true,
                                    },
                                  ]
                              : [
                                  {
                                    value: '',
                                    label:
                                      'Invalid provider, please check backend logs',
                                    disabled: true,
                                  },
                                ];
                          })()}
                        />
                      </div>
                    )}
                  </div>
                )}
              </SettingsSection>

              <SettingsSection title="API Keys">
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col space-y-1">
                    <p className="text-black/70 dark:text-white/70 text-sm">
                      OpenAI API Key
                    </p>
                    <Input
                      type="text"
                      placeholder="OpenAI API Key"
                      value={config.openaiApiKey}
                      isSaving={savingStates['openaiApiKey']}
                      onChange={(e) => {
                        setConfig((prev) => ({
                          ...prev!,
                          openaiApiKey: e.target.value,
                        }));
                      }}
                      onSave={(value) => saveConfig('openaiApiKey', value)}
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <p className="text-black/70 dark:text-white/70 text-sm">
                      Ollama API URL
                    </p>
                    <Input
                      type="text"
                      placeholder="Ollama API URL"
                      value={config.ollamaApiUrl}
                      isSaving={savingStates['ollamaApiUrl']}
                      onChange={(e) => {
                        setConfig((prev) => ({
                          ...prev!,
                          ollamaApiUrl: e.target.value,
                        }));
                      }}
                      onSave={(value) => saveConfig('ollamaApiUrl', value)}
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <p className="text-black/70 dark:text-white/70 text-sm">
                      GROQ API Key
                    </p>
                    <Input
                      type="text"
                      placeholder="GROQ API Key"
                      value={config.groqApiKey}
                      isSaving={savingStates['groqApiKey']}
                      onChange={(e) => {
                        setConfig((prev) => ({
                          ...prev!,
                          groqApiKey: e.target.value,
                        }));
                      }}
                      onSave={(value) => saveConfig('groqApiKey', value)}
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <p className="text-black/70 dark:text-white/70 text-sm">
                      Anthropic API Key
                    </p>
                    <Input
                      type="text"
                      placeholder="Anthropic API key"
                      value={config.anthropicApiKey}
                      isSaving={savingStates['anthropicApiKey']}
                      onChange={(e) => {
                        setConfig((prev) => ({
                          ...prev!,
                          anthropicApiKey: e.target.value,
                        }));
                      }}
                      onSave={(value) => saveConfig('anthropicApiKey', value)}
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <p className="text-black/70 dark:text-white/70 text-sm">
                      Gemini API Key
                    </p>
                    <Input
                      type="text"
                      placeholder="Gemini API key"
                      value={config.geminiApiKey}
                      isSaving={savingStates['geminiApiKey']}
                      onChange={(e) => {
                        setConfig((prev) => ({
                          ...prev!,
                          geminiApiKey: e.target.value,
                        }));
                      }}
                      onSave={(value) => saveConfig('geminiApiKey', value)}
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <p className="text-black/70 dark:text-white/70 text-sm">
                      Deepseek API Key
                    </p>
                    <Input
                      type="text"
                      placeholder="Deepseek API Key"
                      value={config.deepseekApiKey}
                      isSaving={savingStates['deepseekApiKey']}
                      onChange={(e) => {
                        setConfig((prev) => ({
                          ...prev!,
                          deepseekApiKey: e.target.value,
                        }));
                      }}
                      onSave={(value) => saveConfig('deepseekApiKey', value)}
                    />
                  </div>
                </div>
              </SettingsSection>
            </div>
          )
        )}
      </div>
    </AuthLayout>
  );
};

export default Page;
