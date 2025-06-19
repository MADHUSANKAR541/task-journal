'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Heading1,
  Heading2,
  Quote,
  Code
} from 'lucide-react';
import styles from './RichTextEditor.module.scss';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({ 
  content, 
  onChange, 
  placeholder = "Write your thoughts here...",
  className = ""
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      TextStyle,
      Color,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleUnderline = () => editor.chain().focus().toggleUnderline().run();
  const toggleBulletList = () => editor.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor.chain().focus().toggleOrderedList().run();
  const setTextAlign = (align: 'left' | 'center' | 'right') => 
    editor.chain().focus().setTextAlign(align).run();
  const toggleHeading1 = () => editor.chain().focus().toggleHeading({ level: 1 }).run();
  const toggleHeading2 = () => editor.chain().focus().toggleHeading({ level: 2 }).run();
  const toggleBlockquote = () => editor.chain().focus().toggleBlockquote().run();
  const toggleCodeBlock = () => editor.chain().focus().toggleCodeBlock().run();

  return (
    <div className={`${styles.editor} ${className}`}>
      <div className={styles.toolbar}>
        <div className={styles.toolbarGroup}>
          <button
            type="button"
            onClick={toggleBold}
            className={`${styles.toolbarButton} ${editor.isActive('bold') ? styles.active : ''}`}
            title="Bold"
          >
            <Bold size={16} />
          </button>
          <button
            type="button"
            onClick={toggleItalic}
            className={`${styles.toolbarButton} ${editor.isActive('italic') ? styles.active : ''}`}
            title="Italic"
          >
            <Italic size={16} />
          </button>
          <button
            type="button"
            onClick={toggleUnderline}
            className={`${styles.toolbarButton} ${editor.isActive('underline') ? styles.active : ''}`}
            title="Underline"
          >
            <UnderlineIcon size={16} />
          </button>
        </div>

        <div className={styles.toolbarGroup}>
          <button
            type="button"
            onClick={toggleHeading1}
            className={`${styles.toolbarButton} ${editor.isActive('heading', { level: 1 }) ? styles.active : ''}`}
            title="Heading 1"
          >
            <Heading1 size={16} />
          </button>
          <button
            type="button"
            onClick={toggleHeading2}
            className={`${styles.toolbarButton} ${editor.isActive('heading', { level: 2 }) ? styles.active : ''}`}
            title="Heading 2"
          >
            <Heading2 size={16} />
          </button>
        </div>

        <div className={styles.toolbarGroup}>
          <button
            type="button"
            onClick={toggleBulletList}
            className={`${styles.toolbarButton} ${editor.isActive('bulletList') ? styles.active : ''}`}
            title="Bullet List"
          >
            <List size={16} />
          </button>
          <button
            type="button"
            onClick={toggleOrderedList}
            className={`${styles.toolbarButton} ${editor.isActive('orderedList') ? styles.active : ''}`}
            title="Numbered List"
          >
            <ListOrdered size={16} />
          </button>
        </div>

        <div className={styles.toolbarGroup}>
          <button
            type="button"
            onClick={() => setTextAlign('left')}
            className={`${styles.toolbarButton} ${editor.isActive({ textAlign: 'left' }) ? styles.active : ''}`}
            title="Align Left"
          >
            <AlignLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => setTextAlign('center')}
            className={`${styles.toolbarButton} ${editor.isActive({ textAlign: 'center' }) ? styles.active : ''}`}
            title="Align Center"
          >
            <AlignCenter size={16} />
          </button>
          <button
            type="button"
            onClick={() => setTextAlign('right')}
            className={`${styles.toolbarButton} ${editor.isActive({ textAlign: 'right' }) ? styles.active : ''}`}
            title="Align Right"
          >
            <AlignRight size={16} />
          </button>
        </div>

        <div className={styles.toolbarGroup}>
          <button
            type="button"
            onClick={toggleBlockquote}
            className={`${styles.toolbarButton} ${editor.isActive('blockquote') ? styles.active : ''}`}
            title="Quote"
          >
            <Quote size={16} />
          </button>
          <button
            type="button"
            onClick={toggleCodeBlock}
            className={`${styles.toolbarButton} ${editor.isActive('codeBlock') ? styles.active : ''}`}
            title="Code Block"
          >
            <Code size={16} />
          </button>
        </div>
      </div>

      <div className={styles.editorContent}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
} 