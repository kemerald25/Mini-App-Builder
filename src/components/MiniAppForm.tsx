'use client';

import { useState, FormEvent } from 'react';
import { MiniAppConfig } from '@/types';

interface MiniAppFormProps {
  onGenerate: (config: MiniAppConfig) => void;
  isGenerating: boolean;
}

export default function MiniAppForm({ onGenerate, isGenerating }: MiniAppFormProps) {
  const [formData, setFormData] = useState<Partial<MiniAppConfig>>({
    name: '',
    description: '',
    category: 'social',
    features: [''],
    needsTransaction: false,
    needsAgent: false,
    homeUrl: '',
    agentAddress: '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const config: MiniAppConfig = {
      name: formData.name || 'My Mini App',
      description: formData.description || 'A Base Mini App',
      category: formData.category || 'social',
      features: formData.features?.filter(f => f.trim()) || [],
      needsTransaction: formData.needsTransaction || false,
      needsAgent: formData.needsAgent || false,
      homeUrl: formData.homeUrl || 'https://example.com',
      agentAddress: formData.agentAddress || undefined,
    };

    onGenerate(config);
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...(formData.features || []), ''],
    });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...(formData.features || [])];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, features: newFeatures.length > 0 ? newFeatures : [''] });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Mini App Name *
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
          required
          placeholder="My Awesome Mini App"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-2">
          Description *
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
          required
          rows={3}
          placeholder="A brief description of what your Mini App does"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-2">
          Category *
        </label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
          required
        >
          <option value="social">Social</option>
          <option value="gaming">Gaming</option>
          <option value="defi">DeFi</option>
          <option value="utility">Utility</option>
        </select>
      </div>

      <div>
        <label htmlFor="homeUrl" className="block text-sm font-medium mb-2">
          Home URL *
        </label>
        <input
          type="url"
          id="homeUrl"
          value={formData.homeUrl}
          onChange={(e) => setFormData({ ...formData, homeUrl: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
          required
          placeholder="https://your-miniapp.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Features
        </label>
        {formData.features?.map((feature, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={feature}
              onChange={(e) => updateFeature(index, e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
              placeholder="Feature description"
            />
            {formData.features && formData.features.length > 1 && (
              <button
                type="button"
                onClick={() => removeFeature(index)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addFeature}
          className="mt-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
        >
          + Add Feature
        </button>
      </div>

      <div className="space-y-3">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.needsTransaction}
            onChange={(e) => setFormData({ ...formData, needsTransaction: e.target.checked })}
            className="w-5 h-5"
          />
          <span>Needs Transaction Support</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.needsAgent}
            onChange={(e) => setFormData({ ...formData, needsAgent: e.target.checked })}
            className="w-5 h-5"
          />
          <span>Needs Agent Integration</span>
        </label>
      </div>

      {formData.needsAgent && (
        <div>
          <label htmlFor="agentAddress" className="block text-sm font-medium mb-2">
            Agent Address (0x...)
          </label>
          <input
            type="text"
            id="agentAddress"
            value={formData.agentAddress}
            onChange={(e) => setFormData({ ...formData, agentAddress: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
            placeholder="0x..."
            pattern="^0x[a-fA-F0-9]{40}$"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={isGenerating}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
      >
        {isGenerating ? 'Generating...' : 'Generate Mini App'}
      </button>
    </form>
  );
}

