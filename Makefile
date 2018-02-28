XMLLABS ?= "testdata/Informe Laboratorios.xls"
XMLENTS ?= "testdata/Informe Entidades.xls"

all: convlabs convents

.PHONY: convlabs
convlabs:
	node labs2json.js ${XMLLABS}

.PHONY: convents
convents:
	node ents2json.js ${XMLENTS}

.PHONY: help
help:
	@echo 'Conversión de informes de entidades y laboratorios del Registro de entidades de certificación del CTE'
	@echo
	@echo 'Para convertir un archivo de entidades:'
	@echo '		$$ XMLENTS="Informe Entidades.xls make convents'
	@echo
	@echo 'Para convertir un archivo de laboratorioss:'
	@echo '		$$ XMLENTS="Informe Laboratorios.xls" make convlabs'
