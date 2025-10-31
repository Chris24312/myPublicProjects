#!/usr/bin/env python3
"""Tkinter GUI for the Anki plain-text front/back reverser (package version).

This file mirrors the previous top-level GUI but imports the processing logic
from the package so the repository is organized under `src/anki_reverser`.
"""

from __future__ import annotations
import os
import sys
import tkinter as tk
from tkinter import filedialog, messagebox
from typing import Optional

# Import the core logic from the package
try:
    from anki_reverser.reverse_anki_txt import process_lines
except Exception as e:
    process_lines = None
    import_error = e
else:
    import_error = None


class Tooltip:
    """Simple tooltip for Tk widgets.

    Usage:
        tt = Tooltip(widget, lambda: text)
    """

    def __init__(self, widget: tk.Widget, text_getter):
        self.widget = widget
        self._text_getter = text_getter if callable(text_getter) else (lambda: text_getter)
        self._tw = None
        widget.bind("<Enter>", self._enter, add=True)
        widget.bind("<Leave>", self._leave, add=True)

    def _enter(self, event=None):
        text = self._text_getter() or ""
        if not text:
            return
        if self._tw:
            self._tw.destroy()
        self._tw = tk.Toplevel(self.widget)
        self._tw.wm_overrideredirect(True)
        try:
            x = self.widget.winfo_rootx()
            y = self.widget.winfo_rooty() + self.widget.winfo_height()
        except Exception:
            x = y = 0
        self._tw.wm_geometry(f"+{x}+{y}")
        lbl = tk.Label(self._tw, text=text, justify="left", background="#ffffe0", relief="solid", borderwidth=1)
        lbl.pack(ipadx=4, ipady=2)

    def _leave(self, event=None):
        if self._tw:
            try:
                self._tw.destroy()
            except Exception:
                pass
            self._tw = None

    def update_text(self, new_text: str):
        self._text_getter = (lambda: new_text)
        if self._tw:
            self._leave()
            self._enter()


class AnkiReverserGUI:
    def __init__(self, root: tk.Tk):
        self.root = root
        root.title("Anki Deck Reverser")
        root.geometry("420x240")
        root.resizable(False, False)

        container = tk.Frame(root)
        container.place(relx=0.5, rely=0.5, anchor="center")
        container.grid_columnconfigure(0, weight=1)

        # Input file
        self._input_full: Optional[str] = None
        self.input_display_var = tk.StringVar()
        self.input_display_var.set("Choose file...")
        tk.Label(container, text="Input file (Anki Notes in Plain Text):", anchor="center").grid(row=0, column=0, sticky="ew", pady=(0, 4))
        self.input_btn = tk.Button(container, textvariable=self.input_display_var, width=34, anchor="w", command=self.choose_input)
        self.input_btn.grid(row=1, column=0, sticky="ew", pady=(0, 8))

        # Output file
        self._output_full: Optional[str] = None
        self.output_display_var = tk.StringVar()
        self.output_display_var.set("Choose output...")
        tk.Label(container, text="Output file (reversed):", anchor="center").grid(row=2, column=0, sticky="ew", pady=(0, 4))
        self.output_btn = tk.Button(container, textvariable=self.output_display_var, width=34, anchor="w", command=self.choose_output)
        self.output_btn.grid(row=3, column=0, sticky="ew", pady=(0, 8))

        # Options
        self.normalize_newlines_var = tk.BooleanVar(value=True)
        tk.Checkbutton(container, text="Normalize newlines to LF", variable=self.normalize_newlines_var).grid(row=4, column=0, pady=(0, 8))

        # Action buttons
        actions = tk.Frame(container)
        actions.grid(row=5, column=0, pady=(4, 8))
        tk.Button(actions, text="Reverse and Save", width=16, command=self.run_reverse).pack(side="left", padx=6)
        tk.Button(actions, text="Open output folder", width=16, command=self.open_output_folder).pack(side="left", padx=6)

        # Status
        self.status_var = tk.StringVar(value="")
        tk.Label(container, textvariable=self.status_var, anchor="center", width=72, fg="#333").grid(row=6, column=0)

        try:
            self._attach_tooltips()
        except Exception:
            pass

        if process_lines is None:
            self.disable_actions_for_import_error(import_error)

    def disable_actions_for_import_error(self, err):
        self.status_var.set("Error: could not import core logic. Ensure reverse_anki_txt.py is present.")
        messagebox.showerror("Import error", f"Failed to import processing logic: {err}")

    def _attach_tooltips(self):
        def in_text():
            return self._input_full or self.input_display_var.get()

        def out_text():
            return self._output_full or self.output_display_var.get()

        in_tt = Tooltip(self.input_btn, in_text)
        out_tt = Tooltip(self.output_btn, out_text)
        self.input_btn.tooltip = in_tt
        self.output_btn.tooltip = out_tt

    def choose_input(self):
        p = filedialog.askopenfilename(title="Select Anki plain-text export", filetypes=[("Text files", "*.txt"), ("All files", "*.*")])
        if p:
            self._input_full = p
            self.input_display_var.set(self._shorten_path(p))
            base, ext = os.path.splitext(p)
            suggested_full = base + "_reversed" + (ext or ".txt")
            self._output_full = suggested_full
            self.output_display_var.set(self._shorten_path(suggested_full))
            self.status_var.set("Selected input file")
            try:
                self.input_btn.tooltip.update_text(self._input_full)
            except Exception:
                pass

    def choose_output(self):
        p = filedialog.asksaveasfilename(title="Select output file", defaultextension=".txt", filetypes=[("Text files", "*.txt"), ("All files", "*.*")])
        if p:
            self._output_full = p
            self.output_display_var.set(self._shorten_path(p))
            try:
                self.output_btn.tooltip.update_text(self._output_full)
            except Exception:
                pass

    def run_reverse(self):
        inp_display = self.input_display_var.get().strip()
        out_display = self.output_display_var.get().strip()

        if inp_display and os.path.exists(inp_display):
            inp = inp_display
        else:
            inp = self._input_full or inp_display

        if out_display and (os.path.isabs(out_display) or os.path.exists(os.path.dirname(out_display) if out_display else "")):
            out = out_display
        else:
            out = self._output_full or out_display
        if not inp:
            messagebox.showwarning("No input", "Please choose an input file first.")
            return
        if not out:
            messagebox.showwarning("No output", "Please choose an output path first.")
            return
        if not os.path.isfile(inp):
            messagebox.showerror("File not found", "Input file does not exist.")
            return
        try:
            with open(inp, "r", encoding="utf-8") as f:
                lines = f.readlines()
        except Exception as e:
            messagebox.showerror("Read error", f"Failed to read input file: {e}")
            return

        if process_lines is None:
            messagebox.showerror("Internal error", "Processing function not available.")
            return

        out_lines, processed, skipped = process_lines(lines)

        try:
            with open(out, "w", encoding="utf-8", newline="\n" if self.normalize_newlines_var.get() else None) as f:
                f.writelines(out_lines)
        except Exception as e:
            messagebox.showerror("Write error", f"Failed to write output file: {e}")
            return

        self.status_var.set(f"Done. Processed: {processed}, Skipped: {skipped}. Wrote: {out}")
        try:
            self._show_result(True, processed, skipped, out)
        except Exception:
            messagebox.showinfo("Finished", f"Processed: {processed} lines. Skipped: {skipped}.\nWrote: {out}")

    def preview(self):
        inp_display = self.input_display_var.get().strip()
        if inp_display and os.path.exists(inp_display):
            inp = inp_display
        else:
            inp = self._input_full or inp_display

        if not inp or not os.path.isfile(inp):
            messagebox.showwarning("No input", "Please choose a valid input file to preview.")
            return
        try:
            with open(inp, "r", encoding="utf-8") as f:
                lines = f.readlines()
        except Exception as e:
            messagebox.showerror("Read error", f"Failed to read input file: {e}")
            return
        if process_lines is None:
            messagebox.showerror("Internal error", "Processing function not available.")
            return
        out_lines, processed, skipped = process_lines(lines)
        preview_text = "".join(out_lines[:30])
        win = tk.Toplevel(self.root)
        win.title("Preview (first lines)")
        txt = tk.Text(win, wrap="none", width=90, height=20)
        txt.insert("1.0", preview_text)
        txt.config(state="disabled")
        txt.pack(fill="both", expand=True)

    def _shorten_path(self, path: str, maxlen: int = 48) -> str:
        if not path:
            return ""
        sep = "\\" if "\\" in path else "/"
        import re
        parts = [p for p in re.split(r"[\\/]+", path) if p]
        if len(parts) <= 2:
            return path
        last_two = sep.join(parts[-2:])
        return f"...{sep}{last_two}"

    def open_output_folder(self):
        out_display = self.output_display_var.get().strip()
        if out_display and os.path.isabs(out_display):
            out = out_display
        else:
            out = self._output_full or out_display

        if not out:
            messagebox.showwarning("No output path", "Please choose or generate an output path first.")
            return
        folder = os.path.dirname(os.path.abspath(out)) or os.getcwd()
        try:
            if sys.platform == "win32":
                os.startfile(folder)
            elif sys.platform == "darwin":
                os.system(f"open \"{folder}\"")
            else:
                os.system(f"xdg-open \"{folder}\"")
        except Exception:
            messagebox.showinfo("Open folder", f"Output folder: {folder}")

    def _show_result(self, success: bool, processed: int = 0, skipped: int = 0, out_path: str = "", err: Optional[str] = None):
        title = "Success" if success else "Failed"
        dialog = tk.Toplevel(self.root)
        dialog.title(title)
        dialog.transient(self.root)
        dialog.resizable(False, False)

        frm = tk.Frame(dialog, padx=12, pady=12)
        frm.pack(fill="both", expand=True)

        sym = "✔" if success else "✖"
        color = "green" if success else "red"
        icon_lbl = tk.Label(frm, text=sym, fg=color, font=("Segoe UI", 28))
        icon_lbl.grid(row=0, column=0, rowspan=2, sticky="n")

        if success:
            msg = f"Processed: {processed} lines.\nSkipped: {skipped}.\nWrote: {out_path}"
        else:
            msg = f"Operation failed.\n{err or ''}"

        txt = tk.Label(frm, text=msg, justify="left", anchor="w")
        txt.grid(row=0, column=1, sticky="w", padx=(12, 0))

        btn = tk.Button(frm, text="OK", width=10, command=dialog.destroy)
        btn.grid(row=1, column=1, sticky="e", pady=(8, 0))

        try:
            dialog.update_idletasks()
            w = dialog.winfo_reqwidth()
            h = dialog.winfo_reqheight()
            if self.root.winfo_ismapped():
                rx = self.root.winfo_rootx()
                ry = self.root.winfo_rooty()
                rw = self.root.winfo_width()
                rh = self.root.winfo_height()
                x = rx + max(0, (rw - w) // 2)
                y = ry + max(0, (rh - h) // 2)
            else:
                sw = dialog.winfo_screenwidth()
                sh = dialog.winfo_screenheight()
                x = max(0, (sw - w) // 2)
                y = max(0, (sh - h) // 2)
            dialog.geometry(f"{w}x{h}+{x}+{y}")
        except Exception:
            pass

        dialog.grab_set()
        self.root.wait_window(dialog)


def main():
    root = tk.Tk()
    app = AnkiReverserGUI(root)
    root.mainloop()


if __name__ == "__main__":
    main()
