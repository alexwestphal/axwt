package axwt.core


import axwt.util.strings.padBoth
import axwt.util.strings.times
import org.glassfish.hk2.utilities.binding.AbstractBinder
import org.glassfish.jersey.media.multipart.MultiPartFeature
import org.glassfish.jersey.server.monitoring.ApplicationEvent
import org.glassfish.jersey.server.monitoring.RequestEvent
import org.glassfish.jersey.server.ResourceConfig as JerseyResourceConfig
import org.glassfish.jersey.server.monitoring.ApplicationEventListener as JerseyAEL
import org.glassfish.jersey.server.monitoring.RequestEventListener
import org.slf4j.Logger
import org.slf4j.LoggerFactory as SLF4JLoggerFactory
import java.time.Year
import javax.inject.Inject
import javax.ws.rs.ApplicationPath


@ApplicationPath("/api")
class AXWTResourceConfig: JerseyResourceConfig() {

    val logger = SLF4JLoggerFactory.getLogger(AXWTResourceConfig::class.java)

    init {
        packages("axwt.api")

        register(ApplicationEventListener::class.java)
        register(AXWTObjectMapper.Resolver())
        register(WebApplicationExceptionHandler::class.java)
        register(MultiPartFeature::class.java)

        for(binder in listOf(
            LoggerFactory.Binder(),
            MiscBinder()
        )) {
            register(binder)
        }
    }
}

class MiscBinder(): AbstractBinder() {
    override fun configure() {
        val scriptMode = AppOpt.ScriptMode in ApplicationOptions

        if(scriptMode) {

        } else {

        }

    }
}

class ApplicationEventListener @Inject constructor(
    private val logger: Logger
): JerseyAEL {

    override fun onEvent(event: ApplicationEvent) {
        when(event.type) {
            ApplicationEvent.Type.INITIALIZATION_FINISHED -> {

                printStartMessage()
                logger.info("Using AppOptions: $ApplicationOptions")
            }
            ApplicationEvent.Type.DESTROY_FINISHED -> {

            }
            else -> {}
        }
    }

    override fun onRequest(event: RequestEvent): RequestEventListener = RequestEventListener {}

    fun printStartMessage() {
        println("""
            ┌${"─" * 78}┐
            │${"${ProjectProperties.displayName} v${ProjectProperties.version}".padBoth(78)}│
            │${"Copyright (c) 2019-${Year.now()}, Alex Westphal. All rights reserved".padBoth(78)}│
            └${"─" * 78}┘
        """.trimIndent())
    }
}