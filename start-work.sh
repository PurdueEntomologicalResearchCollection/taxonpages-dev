#!/bin/bash
# Safe startup script for taxonpages development
# Prevents accidentally overwriting config changes

# Save existing config
if [ -d "config" ]; then
    BACKUP_DIR="/tmp/taxonpages-config-$(date +%Y%m%d-%H%M%S)"
    echo "📁 Backing up config to $BACKUP_DIR"
    cp -r config "$BACKUP_DIR"

    # Check if there were actual changes
    if [ -d "$BACKUP_DIR/style" ]; then
        echo "   Found style configs: $(ls -1 $BACKUP_DIR/style/*.css 2>/dev/null | wc -l) CSS files"
    fi
else
    echo "📁 No existing config directory to backup"
fi

# Get setup branch files
echo "🔄 Fetching config from dev-setup branch..."
git checkout dev-setup -- config/
git reset .
git checkout .gitignore
rm -f .github/workflows/jekyll-gh-pages.yml .github/dependabot.yml

echo "✅ Workspace ready!"

if [ -n "$BACKUP_DIR" ] && [ -d "$BACKUP_DIR" ]; then
    echo ""
    echo "💡 To restore your previous config changes:"
    echo "   cp -r $BACKUP_DIR/* config/"
    echo ""
    echo "📝 To see what was in your backup:"
    echo "   ls -la $BACKUP_DIR/style/"
fi