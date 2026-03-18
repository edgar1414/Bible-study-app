import { useState } from 'react';
import { useTags } from '../../hooks/useTags';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { DEFAULT_TAGS } from '../../lib/constants';
import { Plus, Trash2 } from 'lucide-react';
import { db } from '../../db';

export function TagManager() {
  const { tags, addTag, deleteTag } = useTags();
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#007AFF');
  const [showAdd, setShowAdd] = useState(false);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    await addTag(newName.trim(), newColor);
    setNewName('');
    setShowAdd(false);
  };

  const seedDefaults = async () => {
    for (const tag of DEFAULT_TAGS) {
      const existing = await db.tags.where('name').equals(tag.name).first();
      if (!existing) {
        await addTag(tag.name, tag.color);
      }
    }
  };

  return (
    <GlassCard className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-apple-600">Tags</h3>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="text-accent hover:opacity-80 transition-opacity"
        >
          <Plus size={18} />
        </button>
      </div>

      {tags.length === 0 && (
        <div className="text-center py-4">
          <p className="text-xs text-apple-400 mb-2">No tags yet</p>
          <Button variant="secondary" size="sm" onClick={seedDefaults}>
            Add Default Tags
          </Button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <div
            key={tag.id}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
          >
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tag.color }} />
            {tag.name}
            <button
              onClick={() => deleteTag(tag.id!)}
              className="ml-1 hover:opacity-60 transition-opacity"
            >
              <Trash2 size={10} />
            </button>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="flex items-end gap-2 pt-2 border-t border-white/30">
          <div className="flex-1">
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Tag name"
              className="w-full text-sm rounded-lg border border-white/30 bg-white px-3 py-1.5 text-apple-700 focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>
          <input
            type="color"
            value={newColor}
            onChange={e => setNewColor(e.target.value)}
            className="w-8 h-8 rounded-lg border border-white/30 cursor-pointer"
          />
          <Button size="sm" onClick={handleAdd}>Add</Button>
        </div>
      )}
    </GlassCard>
  );
}
